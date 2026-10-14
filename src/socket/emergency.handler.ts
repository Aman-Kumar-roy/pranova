import { Server as SocketIOServer, Socket } from 'socket.io';
import { Role, CasePriority, CaseStatus, CaseTriggerSource, Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma.js';

export interface EmergencySosPayload {
  patientId?: string;
  patientPhone?: string;
  incidentLatitude?: number;
  incidentLongitude?: number;
  incidentAddress?: string;
  title?: string;
  description?: string;
}

export const triggerEmergencySOS = async (io: SocketIOServer, payload: EmergencySosPayload) => {
  // 1. Resolve Patient
  let patient: (Prisma.UserGetPayload<{ include: { patientProfile: true } }>) | null = null;

  if (payload.patientId) {
    patient = await prisma.user.findFirst({
      where: { id: payload.patientId, role: Role.PATIENT },
      include: { patientProfile: true },
    });
  } else if (payload.patientPhone) {
    patient = await prisma.user.findFirst({
      where: { phone: payload.patientPhone, role: Role.PATIENT },
      include: { patientProfile: true },
    });
  }

  // Fallback: If no patient specified, fetch the first registered patient or default patient
  if (!patient) {
    patient = await prisma.user.findFirst({
      where: { role: Role.PATIENT },
      include: { patientProfile: true },
    });
  }

  if (!patient) {
    throw new Error('No registered patient profile found in database to attach emergency SOS alert');
  }

  const patientName = patient.patientProfile
    ? `${patient.patientProfile.firstName} ${patient.patientProfile.lastName}`.trim()
    : 'Emergency Patient';

  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const caseNumber = `PRN-${year}-${randomSuffix}`;

  const incidentAddress =
    payload.incidentAddress ||
    patient.patientProfile?.primaryAddress ||
    '104, Indiranagar 100ft Road, Bengaluru';

  const incidentLatitude = payload.incidentLatitude ?? patient.patientProfile?.latitude ?? 12.9784;
  const incidentLongitude = payload.incidentLongitude ?? patient.patientProfile?.longitude ?? 77.6408;

  // 2. Transactionally create P1 Case + CaseTimeline
  const createdCase = await prisma.$transaction(async (tx) => {
    const newCase = await tx.case.create({
      data: {
        caseNumber,
        patientId: patient.id,
        priority: CasePriority.P1,
        status: CaseStatus.OPEN,
        title: payload.title || 'EMERGENCY SOS: Acute Medical Distress Triggered',
        description:
          payload.description ||
          'Patient triggered immediate emergency SOS signal via mobile application. Immediate care manager and ambulance triage required.',
        triggerSource: CaseTriggerSource.SOS_BUTTON,
        incidentAddress,
        incidentLatitude,
        incidentLongitude,
      },
    });

    await tx.caseTimeline.create({
      data: {
        caseId: newCase.id,
        actorId: patient.id,
        actorRole: Role.PATIENT,
        action: 'EMERGENCY_SOS_TRIGGERED',
        newStatus: CaseStatus.OPEN,
        notes: payload.description || 'Emergency SOS button triggered from mobile application. Immediate triage initiated.',
        locationLatitude: incidentLatitude,
        locationLongitude: incidentLongitude,
      },
    });

    return newCase;
  });

  const emergencyAlertPayload = {
    caseId: createdCase.id,
    caseNumber: createdCase.caseNumber,
    priority: 'P1',
    status: 'OPEN',
    title: createdCase.title,
    description: createdCase.description,
    patientId: patient.id,
    patientName,
    patientPhone: patient.phone,
    patientBloodGroup: patient.patientProfile?.bloodGroup || 'B+',
    incidentAddress: createdCase.incidentAddress,
    incidentLatitude: createdCase.incidentLatitude,
    incidentLongitude: createdCase.incidentLongitude,
    timestamp: new Date().toISOString(),
  };

  // 3. Emit real-time emergency alert to Admin clients
  console.log(`[SOCKET] Broadcasting 'admin:new_emergency' for Case ${createdCase.caseNumber}`);
  io.to('admin_room').emit('admin:new_emergency', emergencyAlertPayload);
  io.emit('admin:new_emergency', emergencyAlertPayload);

  return emergencyAlertPayload;
};

export const handleEmergencyEvent = async (
  io: SocketIOServer,
  _socket: Socket,
  payload: EmergencySosPayload
) => {
  return triggerEmergencySOS(io, payload);
};
