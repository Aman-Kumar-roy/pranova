import jwt, { SignOptions } from 'jsonwebtoken';
import { TokenPayload, AuthTokens } from '../types/auth.types.js';
import { ApiError } from './apiError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pranova_fallback_jwt_secret_healthcare_2026';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'pranova_fallback_refresh_secret_2026';
const JWT_REFRESH_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']) || '7d';

export class JwtUtils {
  static generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: String(JWT_EXPIRES_IN),
    };
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Access token has expired. Please refresh your session.');
      }
      throw ApiError.unauthorized('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Refresh token has expired. Please sign in again.');
      }
      throw ApiError.unauthorized('Invalid refresh token');
    }
  }
}
