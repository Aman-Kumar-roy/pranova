import { Request, Response, NextFunction } from 'express';
import { ProviderService } from '../services/provider.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ProviderController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProviderService.list(req.query);
      return ApiResponse.send({
        res,
        statusCode: 200,
        message: 'Healthcare providers retrieved successfully',
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
      const provider = await ProviderService.getById(id);
      return ApiResponse.success(res, 'Healthcare provider retrieved successfully', provider);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const provider = await ProviderService.create(req.body);
      return ApiResponse.created(res, 'Healthcare provider created successfully', provider);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const provider = await ProviderService.update(id, req.body);
      return ApiResponse.success(res, 'Healthcare provider updated successfully', provider);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const provider = await ProviderService.updateStatus(id, req.body);
      return ApiResponse.success(res, `Provider status changed to ${provider.status}`, provider);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await ProviderService.delete(id);
      return ApiResponse.success(res, result.message, result);
    } catch (error) {
      next(error);
    }
  }
}
