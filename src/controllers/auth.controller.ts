import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class AuthController {
  /**
   * POST /api/v1/auth/admin/login
   */
  static async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.adminLogin(req.body);

      // Attach secure HttpOnly cookie for refresh token
      if (result.tokens?.refreshToken) {
        res.cookie('refreshToken', result.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      return ApiResponse.success(res, 'Admin authentication successful', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/admin/register
   */
  static async adminRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.adminRegister(req.body);
      return ApiResponse.created(res, 'Administrator created successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/otp/send
   */
  static async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.sendOtp(req.body);
      return ApiResponse.success(res, result.message, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/otp/verify
   */
  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.verifyOtp(req.body);

      if (result.tokens?.refreshToken) {
        res.cookie('refreshToken', result.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      return ApiResponse.success(res, 'OTP verified and session authenticated', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh-token
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Prioritize HttpOnly cookie, fall back to request body
      const refreshToken = (req.cookies?.refreshToken as string) || req.body?.refreshToken;
      if (!refreshToken) {
        throw ApiError.badRequest('Refresh token is required via cookie or payload');
      }

      const result = await AuthService.refreshTokens(refreshToken);

      if (result.tokens?.refreshToken) {
        res.cookie('refreshToken', result.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      return ApiResponse.success(res, 'Token refreshed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('User session not found');
      }
      const user = await AuthService.getMe(req.user.id);
      return ApiResponse.success(res, 'User profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }
}
