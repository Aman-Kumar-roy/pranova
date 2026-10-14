import { CasePriority, CaseStatus, Role, Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { CreateCaseInput, AssignCaseInput, UpdateCaseStatusInput } from '../validators/case.validator.js';
import { CaseQueryFilter } from '../types/query.types.js';

export class CaseService {
  /**
   * List Cases with pagination, search, priority & status filtering
   */
  static async list(query: CaseQueryFilter) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const perPage = Math.max(1, parseInt(query.perPage || '10', 10));
    const sort = query.sort || 'createdAt';
    const order = (query.order || 'DESC').toLowerCase() === 'asc' ? 'asc' : 'desc';
    const search = query.q || query.caseNumber || query.title;
    const priorityFilter = query.priority as CasePriority | undefined;
    const statusFilter = query.status as CaseStatus | undefined;
    const careManagerIdFilter = query.careManagerId as string | undefined;

    const where: Prisma.CaseWhereInput = {
      ...(priorityFilter ? { priority: priorityFilter } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(careManagerIdFilter ? { careManagerId: careManagerIdFilter } : {}),
      ...(search
        ? {
            OR: [
              { caseNumber: { contains: search, mode: 'insensitive' } },
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              {
                patient: {
                  patientProfile: {
                    OR: [
                      { firstName: { contains: search, mode: 'insensitive' } },
                      { lastName: { contains: search, mode: 'insensitive' } },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    };

    const total = await prisma.case.count({ where });
    const cases = await prisma.case.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { [sort]: order },
        include: {
          patient: {
            include: { patientProfile: true },
          },
          careManager: {
            include: { careManagerProfile: true },
          },
          provider: true,
          _count: {
            select: { timeline: true },
          },
        },
      });

    const formattedData = cases.map((c) => ({
      id: c.id,
      caseNumber: c.caseNumber,
      title: c.title,
      description: c.description,
      priority: c.priority,
      status: c.status,
      triggerSource: c.triggerSource,
      patientId: c.patientId,
      patientName: c.patient.patientProfile
        ? `${c.patient.patientProfile.firstName} ${c.patient.patientProfile.lastName}`.trim()
        : 'Unknown Patient',
      patientPhone: c.patient.phone,
      patientBloodGroup: c.patient.patientProfile?.bloodGroup,
      patientAddress: c.patient.patientProfile?.primaryAddress,
      careManagerId: c.careManagerId,
      careManagerName: c.careManager?.careManagerProfile
        ? `${c.careManager.careManagerProfile.firstName} ${c.careManager.careManagerProfile.lastName}`.trim()
        : 'Unassigned',
      careManagerPhone: c.careManager?.phone,
      careManagerCode: c.careManager?.careManagerProfile?.employeeCode,
      providerId: c.providerId,
      providerName: c.provider?.name || null,
      incidentAddress: c.incidentAddress,
      incidentLatitude: c.incidentLatitude,
      incidentLongitude: c.incidentLongitude,
      assignedAt: c.assignedAt,
      resolvedAt: c.resolvedAt,
      timelineEventsCount: c._count.timeline,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return {
      data: formattedData,
      total,
      page,
      perPage,
    };
  }

  /**
   * Get single Case with complete patient, assigned care manager, provider, and timeline history
   */
  static async getById(id: string) {
    const c = await prisma.case.findUnique({
      where: { id },
      include: {
        patient: {
          include: { patientProfile: true },
        },
        careManager: {
          include: { careManagerProfile: true },
        },
        provider: true,
        timeline: {
          orderBy: { createdAt: 'desc' },
          include: {
            actor: {
              include: {
                adminProfile: true,
                careManagerProfile: true,
                patientProfile: true,
              },
            },
          },
        },
      },
    });

    if (!c) {
      throw ApiError.notFound('Healthcare coordination case not found');
    }

    const patientName = c.patient.patientProfile
      ? `${c.patient.patientProfile.firstName} ${c.patient.patientProfile.lastName}`.trim()
      : 'Unknown Patient';

    const careManagerName = c.careManager?.careManagerProfile
      ? `${c.careManager.careManagerProfile.firstName} ${c.careManager.careManagerProfile.lastName}`.trim()
      : null;

    const formattedTimeline = c.timeline.map((entry) => {
      let actorName = 'System Automated';
      if (entry.actor?.adminProfile) {
        actorName = `Admin: ${entry.actor.adminProfile.firstName} ${entry.actor.adminProfile.lastName}`;
      } else if (entry.actor?.careManagerProfile) {
        actorName = `Care Manager: ${entry.actor.careManagerProfile.firstName} ${entry.actor.careManagerProfile.lastName}`;
      } else if (entry.actor?.patientProfile) {
        actorName = `Patient: ${entry.actor.patientProfile.firstName} ${entry.actor.patientProfile.lastName}`;
      }

      return {
        id: entry.id,
        action: entry.action,
        oldStatus: entry.oldStatus,
        newStatus: entry.newStatus,
        notes: entry.notes,
        actorId: entry.actorId,
        actorRole: entry.actorRole,
        actorName,
        createdAt: entry.createdAt,
      };
    });

    return {
      id: c.id,
      caseNumber: c.caseNumber,
      title: c.title,
      description: c.description,
      priority: c.priority,
      status: c.status,
      triggerSource: c.triggerSource,
      patientId: c.patientId,
      patientName,
      patientPhone: c.patient.phone,
      patientBloodGroup: c.patient.patientProfile?.bloodGroup,
      patientAddress: c.patient.patientProfile?.primaryAddress,
      patientEmergencyContact: c.patient.patientProfile?.emergencyContactName,
      patientEmergencyPhone: c.patient.patientProfile?.emergencyContactPhone,
      careManagerId: c.careManagerId,
      careManagerName,
      careManagerPhone: c.careManager?.phone,
      careManagerCode: c.careManager?.careManagerProfile?.employeeCode,
      providerId: c.providerId,
      providerName: c.provider?.name || null,
      providerPhone: c.provider?.phone || null,
      incidentAddress: c.incidentAddress,
      incidentLatitude: c.incidentLatitude,
      incidentLongitude: c.incidentLongitude,
      assignedAt: c.assignedAt,
      resolvedAt: c.resolvedAt,
      timeline: formattedTimeline,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  /**
   * Create Case (Logs initial entry in CaseTimeline)
   */
  static async create(input: CreateCaseInput, actorId?: string, actorRole?: Role) {
    const patient = await prisma.user.findFirst({
      where: { id: input.patientId, role: Role.PATIENT },
    });

    if (!patient) {
      throw ApiError.notFound('Patient not found');
    }

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const caseNumber = `PRN-${year}-${randomSuffix}`;

    const createdCase = await prisma.$transaction(async (tx) => {
      const newCase = await tx.case.create({
        data: {
          caseNumber,
          patientId: input.patientId,
          priority: input.priority,
          status: CaseStatus.OPEN,
          title: input.title,
          description: input.description,
          triggerSource: input.triggerSource,
          providerId: input.providerId,
          incidentAddress: input.incidentAddress,
          incidentLatitude: input.incidentLatitude,
          incidentLongitude: input.incidentLongitude,
          metadata: input.metadata || Prisma.JsonNull,
        },
      });

      // Log creation in CaseTimeline
      await tx.caseTimeline.create({
        data: {
          caseId: newCase.id,
          actorId: actorId || null,
          actorRole: actorRole || Role.ADMIN,
          action: 'CASE_CREATED',
          newStatus: CaseStatus.OPEN,
          notes: `Case initialized with priority ${input.priority} via ${input.triggerSource}`,
        },
      });

      return newCase;
    });

    return this.getById(createdCase.id);
  }

  /**
   * Assign Case to Care Manager
   * HARD REQUIREMENT: Must create a CaseTimeline entry in the database.
   */
  static async assign(
    caseId: string,
    input: AssignCaseInput,
    actorId?: string,
    actorRole?: Role
  ) {
    const targetCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!targetCase) {
      throw ApiError.notFound('Case not found');
    }

    const careManager = await prisma.user.findFirst({
      where: { id: input.careManagerId, role: Role.CARE_MANAGER },
      include: { careManagerProfile: true },
    });

    if (!careManager || !careManager.careManagerProfile) {
      throw ApiError.notFound('Care Manager not found or invalid role');
    }

    const cmName = `${careManager.careManagerProfile.firstName} ${careManager.careManagerProfile.lastName}`.trim();
    const oldStatus = targetCase.status;
    const newStatus = CaseStatus.ASSIGNED;

    await prisma.$transaction(async (tx) => {
      // 1. Update Case
      await tx.case.update({
        where: { id: caseId },
        data: {
          careManagerId: input.careManagerId,
          status: newStatus,
          assignedAt: new Date(),
        },
      });

      // 2. Insert Timeline Entry
      await tx.caseTimeline.create({
        data: {
          caseId,
          actorId: actorId || null,
          actorRole: actorRole || Role.ADMIN,
          action: 'CARE_MANAGER_ASSIGNED',
          oldStatus,
          newStatus,
          notes: input.notes
            ? `Assigned to Care Manager ${cmName} (${careManager.careManagerProfile?.employeeCode || 'No Code'}). Notes: ${input.notes}`
            : `Assigned to Care Manager ${cmName} (${careManager.careManagerProfile?.employeeCode || 'No Code'})`,
        },
      });
    });

    return this.getById(caseId);
  }

  /**
   * Update Case Status with Timeline Logging
   */
  static async updateStatus(
    caseId: string,
    input: UpdateCaseStatusInput,
    actorId?: string,
    actorRole?: Role
  ) {
    const targetCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!targetCase) {
      throw ApiError.notFound('Case not found');
    }

    const oldStatus = targetCase.status;
    const newStatus = input.status;

    await prisma.$transaction(async (tx) => {
      await tx.case.update({
        where: { id: caseId },
        data: {
          status: newStatus,
          resolvedAt: newStatus === CaseStatus.RESOLVED ? new Date() : undefined,
        },
      });

      await tx.caseTimeline.create({
        data: {
          caseId,
          actorId: actorId || null,
          actorRole: actorRole || Role.ADMIN,
          action: `STATUS_CHANGED_TO_${newStatus}`,
          oldStatus,
          newStatus,
          notes: input.notes || `Case status transitioned from ${oldStatus} to ${newStatus}`,
        },
      });
    });

    return this.getById(caseId);
  }
}
