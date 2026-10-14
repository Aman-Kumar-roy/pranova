import { PrismaClient, Role, UserStatus, ProviderType, ProviderStatus, CasePriority, CaseStatus, CaseTriggerSource } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Starting PRANOVA database seed...');

  // 1. Seed System Admin (Configured via .env Admin Credentials)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pranova.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Super';
  const adminLastName = process.env.ADMIN_LAST_NAME || 'Admin';
  const adminDepartment = process.env.ADMIN_DEPARTMENT || 'Operations';

  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        adminProfile: {
          create: {
            firstName: adminFirstName,
            lastName: adminLastName,
            department: adminDepartment,
            mfaEnabled: false,
          },
        },
      },
    });
    console.log(`[SEED] Created default Admin from .env: ${adminUser.email}`);
  } else {
    console.log(`[SEED] Admin already exists: ${adminEmail}`);
  }

  // 2. Seed Sample Care Manager
  const cmPhone = '+919876543210';
  let careManagerUser = await prisma.user.findUnique({
    where: { phone: cmPhone },
  });

  if (!careManagerUser) {
    careManagerUser = await prisma.user.create({
      data: {
        phone: cmPhone,
        role: Role.CARE_MANAGER,
        status: UserStatus.ACTIVE,
        isPhoneVerified: true,
        careManagerProfile: {
          create: {
            firstName: 'Rahul',
            lastName: 'Sharma',
            employeeCode: 'CM-1001',
            specialization: 'Emergency Response & Cardiac Triage',
            isAvailable: true,
            currentLatitude: 12.9716,
            currentLongitude: 77.5946,
            assignedZone: 'Central Bengaluru',
          },
        },
      },
    });
    console.log(`[SEED] Created sample Care Manager: ${careManagerUser.phone}`);
  }

  // 3. Seed Sample Patient
  const patientPhone = '+919123456789';
  let patientUser = await prisma.user.findUnique({
    where: { phone: patientPhone },
  });

  if (!patientUser) {
    patientUser = await prisma.user.create({
      data: {
        phone: patientPhone,
        role: Role.PATIENT,
        status: UserStatus.ACTIVE,
        isPhoneVerified: true,
        patientProfile: {
          create: {
            firstName: 'Ananya',
            lastName: 'Iyer',
            gender: 'Female',
            bloodGroup: 'B+',
            primaryAddress: '104, Indiranagar 100ft Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            latitude: 12.9784,
            longitude: 77.6408,
            emergencyContactName: 'Vikram Iyer',
            emergencyContactPhone: '+919876543211',
          },
        },
      },
    });
    console.log(`[SEED] Created sample Patient: ${patientUser.phone}`);
  }

  // 4. Seed Sample Providers (Hospitals & Diagnostics)
  let hospital = await prisma.provider.findFirst({
    where: { name: 'Apollo Multispeciality Hospital' },
  });

  if (!hospital) {
    hospital = await prisma.provider.create({
      data: {
        name: 'Apollo Multispeciality Hospital',
        type: ProviderType.HOSPITAL,
        status: ProviderStatus.ACTIVE,
        licenseNumber: 'HOSP-BLR-2024-099',
        contactPerson: 'Dr. Ramesh Kumar',
        phone: '+918022223333',
        email: 'emergency@apolloblr.org',
        address: '154/11 Bannerghatta Main Rd',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560076',
        latitude: 12.8988,
        longitude: 77.5985,
        rating: 4.8,
      },
    });
    console.log('[SEED] Created sample Hospital Provider: Apollo Multispeciality Hospital');
  }

  // 5. Seed Initial Coordination Case
  const existingCase = await prisma.case.findFirst({
    where: { caseNumber: 'PRN-2026-1001' },
  });

  if (!existingCase && patientUser) {
    const initialCase = await prisma.case.create({
      data: {
        caseNumber: 'PRN-2026-1001',
        patientId: patientUser.id,
        providerId: hospital?.id,
        priority: CasePriority.P1,
        status: CaseStatus.OPEN,
        title: 'Acute Chest Discomfort - Cardiac Dispatch Required',
        description: 'Patient triggered SOS alert with severe chest pain symptoms. Requires immediate field evaluation and hospital bed reservation.',
        triggerSource: CaseTriggerSource.SOS_BUTTON,
        incidentAddress: '104, Indiranagar 100ft Road, Bengaluru',
        incidentLatitude: 12.9784,
        incidentLongitude: 77.6408,
        timeline: {
          create: {
            action: 'CASE_CREATED',
            newStatus: CaseStatus.OPEN,
            actorId: patientUser.id,
            actorRole: Role.PATIENT,
            notes: 'Emergency SOS button triggered from mobile application. Immediate triage required.',
          },
        },
      },
    });
    console.log(`[SEED] Created sample Case: ${initialCase.caseNumber} (Priority: P1)`);
  }

  console.log('[SEED] Database seeding complete.');
}

main()
  .catch((e) => {
    console.error('[SEED] Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
