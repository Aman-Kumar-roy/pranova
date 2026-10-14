import { Response } from 'express';

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export class ApiResponse {
  static send<T>({
    res,
    statusCode = 200,
    message = 'Success',
    data,
    meta,
  }: ApiResponseOptions<T>) {
    return res.status(statusCode).json({
      success: statusCode >= 200 && statusCode < 300,
      message,
      data: data ?? null,
      meta,
      timestamp: new Date().toISOString(),
    });
  }

  static created<T>(res: Response, message: string, data: T) {
    return ApiResponse.send({ res, statusCode: 201, message, data });
  }

  static success<T>(res: Response, message: string, data?: T, meta?: Record<string, unknown>) {
    return ApiResponse.send({ res, statusCode: 200, message, data, meta });
  }
}
