import { Role } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  role: Role;
  email?: string | null;
  phone?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthenticatedUser {
  id: string;
  role: Role;
  email?: string | null;
  phone?: string | null;
  firstName?: string;
  lastName?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
