import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.js';

// Sensitive keys to sanitize from audit log payloads
const SENSITIVE_KEYS = ['password', 'passwordHash', 'token', 'accessToken', 'refreshToken', 'otp', 'mfaSecret'];

const sanitizePayload = (payload: unknown): unknown => {
  if (!payload || typeof payload !== 'object') return payload;

  if (Array.isArray(payload)) {
    return payload.map(sanitizePayload);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.includes(key)) {
      sanitized[key] = '[REDACTED_SENSITIVE]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const deriveResourceAndAction = (method: string, path: string): { resource: string; action: string } => {
  const parts = path.split('/').filter(Boolean);
  // e.g. /api/v1/providers -> resource = Provider
  const resourcePart = parts[2] || parts[1] || 'System';

  let resource = resourcePart.charAt(0).toUpperCase() + resourcePart.slice(1);
  if (resource === 'Providers') resource = 'Provider';
  if (resource === 'Patients') resource = 'Patient';
  if (resource === 'Care-managers') resource = 'CareManager';
  if (resource === 'Cases') resource = 'Case';

  let action = `${method}_${resource.toUpperCase()}`;
  if (path.includes('/assign')) {
    action = 'ASSIGN_CASE';
  } else if (path.includes('/status')) {
    action = `UPDATE_${resource.toUpperCase()}_STATUS`;
  } else if (path.includes('/export')) {
    action = `EXPORT_${resource.toUpperCase()}`;
  }

  return { resource, action };
};

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  // Only audit state-modifying mutations (POST, PATCH, PUT, DELETE)
  const isMutation = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method);
  // Also audit specific export endpoints even if requested via GET
  const isExport = req.path.includes('/export');

  if (!isMutation && !isExport) {
    return next();
  }

  // Capture original payload before any downstream changes
  const requestPayload = req.body ? sanitizePayload(req.body) : undefined;
  const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown Client';

  res.on('finish', async () => {
    try {
      const { resource, action } = deriveResourceAndAction(req.method, req.originalUrl);
      const resourceId = (req.params?.id as string) || req.body?.id || undefined;
      const status = res.statusCode >= 200 && res.statusCode < 400 ? 'SUCCESS' : 'FAILED';
      const reason = req.body?.reason || (req.query?.reason as string) || undefined;

      await prisma.auditLog.create({
        data: {
          actorId: req.user?.id || null,
          actorEmail: req.user?.email || null,
          actorRole: req.user?.role || null,
          action,
          resource,
          resourceId,
          endpoint: req.originalUrl,
          httpMethod: req.method,
          requestPayload: requestPayload ? (requestPayload as any) : undefined,
          reason,
          ipAddress,
          userAgent,
          status,
        },
      });
    } catch (error) {
      console.error('[AUDIT_LOG_ERROR] Failed to record audit log entry:', error);
    }
  });

  next();
};
