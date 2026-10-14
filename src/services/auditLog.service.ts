import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { AuditLogQueryFilter } from '../types/query.types.js';

export class AuditLogService {
  /**
   * List Audit Logs with pagination and filters
   */
  static async list(query: AuditLogQueryFilter) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const perPage = Math.max(1, parseInt(query.perPage || '10', 10));
    const sort = query.sort || 'createdAt';
    const order = (query.order || 'DESC').toLowerCase() === 'asc' ? 'asc' : 'desc';
    const search = query.q || query.action || query.actorEmail;
    const resourceFilter = query.resource as string | undefined;
    const actionFilter = query.action as string | undefined;

    const where: Prisma.AuditLogWhereInput = {
      ...(resourceFilter ? { resource: resourceFilter } : {}),
      ...(actionFilter ? { action: actionFilter } : {}),
      ...(search
        ? {
            OR: [
              { actorEmail: { contains: search, mode: 'insensitive' } },
              { action: { contains: search, mode: 'insensitive' } },
              { resource: { contains: search, mode: 'insensitive' } },
              { reason: { contains: search, mode: 'insensitive' } },
              { endpoint: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const total = await prisma.auditLog.count({ where });
    const logs = await prisma.auditLog.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { [sort]: order },
    });

    return {
      data: logs,
      total,
      page,
      perPage,
    };
  }

  /**
   * Get single Audit Log entry by ID
   */
  static async getById(id: string) {
    const log = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        actor: {
          include: {
            adminProfile: true,
          },
        },
      },
    });

    if (!log) {
      throw ApiError.notFound('Audit log entry not found');
    }

    return log;
  }
}
