import { PrismaClient } from '@prisma/client';

const createPrismaClient = () => {
  const baseClient = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

  // Immutability Guard: Programmatically prevent updates and deletions on audit trails
  return baseClient.$extends({
    query: {
      auditLog: {
        async update() {
          throw new Error('Compliance Violation: AuditLog records are immutable and cannot be updated.');
        },
        async updateMany() {
          throw new Error('Compliance Violation: AuditLog records are immutable and cannot be updated.');
        },
        async delete() {
          throw new Error('Compliance Violation: AuditLog records are immutable and cannot be deleted.');
        },
        async deleteMany() {
          throw new Error('Compliance Violation: AuditLog records are immutable and cannot be deleted.');
        },
      },
      caseTimeline: {
        async update() {
          throw new Error('Compliance Violation: CaseTimeline records are immutable and cannot be updated.');
        },
        async updateMany() {
          throw new Error('Compliance Violation: CaseTimeline records are immutable and cannot be updated.');
        },
        async delete() {
          throw new Error('Compliance Violation: CaseTimeline records are immutable and cannot be deleted.');
        },
        async deleteMany() {
          throw new Error('Compliance Violation: CaseTimeline records are immutable and cannot be deleted.');
        },
      },
    },
  });
};

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: ExtendedPrismaClient | undefined;
}

export const prisma: ExtendedPrismaClient = global.__prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;
