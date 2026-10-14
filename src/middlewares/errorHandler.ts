import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown = undefined;

  // Handle custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Handle Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
  }
  // Handle Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
      message = `Unique constraint violation on ${target}`;
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Requested record not found';
    } else if (err.code === 'P2003') {
      statusCode = 400;
      message = 'Foreign key constraint failed';
    }
  }
  // Handle JSON parsing syntax error
  else if (err instanceof SyntaxError && 'body' in (err as unknown as Record<string, unknown>)) {
    statusCode = 400;
    message = 'Invalid JSON payload received';
  } else if (err instanceof Error) {
    message = err.message;
  }

  // Healthcare compliance: Never leak stack trace or sensitive info in production
  const responsePayload: Record<string, unknown> = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  if (errors !== undefined) {
    responsePayload.errors = errors;
  }

  if (process.env.NODE_ENV === 'development' && err instanceof Error && err.stack) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};
