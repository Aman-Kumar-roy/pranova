import { Request, Response, NextFunction } from 'express';
import { CareManagerService } from '../services/careManager.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class CareManagerController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CareManagerService.list(req.query);
      return ApiResponse.send({
        res,
        statusCode: 200,
        message: 'Care Managers retrieved successfully',
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
      const careManager = await CareManagerService.getById(id);
      return ApiResponse.success(res, 'Care Manager retrieved successfully', careManager);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const careManager = await CareManagerService.create(req.body);
      return ApiResponse.created(res, 'Care Manager created successfully', careManager);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const careManager = await CareManagerService.update(id, req.body);
      return ApiResponse.success(res, 'Care Manager updated successfully', careManager);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await CareManagerService.delete(id);
      return ApiResponse.success(res, result.message, result);
    } catch (error) {
      next(error);
    }
  }
}
