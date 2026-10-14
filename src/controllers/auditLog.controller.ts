import { Request, Response, NextFunction } from 'express';
import { AuditLogService } from '../services/auditLog.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AuditLogController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuditLogService.list(req.query);
      return ApiResponse.send({
        res,
        statusCode: 200,
        message: 'Audit logs retrieved successfully',
        data: result.data,
        meta: {
          total: result.total,
          page: result.page,
          perPage: result.perPage,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const log = await AuditLogService.getById(id);
      return ApiResponse.success(res, 'Audit log details retrieved successfully', log);
    } catch (error) {
      next(error);
    }
  }
}
