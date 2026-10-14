import { Request, Response, NextFunction } from 'express';
import { Role, UserStatus } from '@prisma/client';
import { JwtUtils } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';
import { prisma } from '../utils/prisma.js';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or malformed Authorization header. Expected "Bearer <token>"');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Authorization token not provided');
    }

    const payload = JwtUtils.verifyAccessToken(token);

    // Fetch user from DB to ensure account is active and verify role
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        adminProfile: true,
        patientProfile: true,
        careManagerProfile: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw ApiError.forbidden(`Account is ${user.status.toLowerCase()}. Access denied.`);
    }

    let firstName: string | undefined;
    let lastName: string | undefined;

    if (user.adminProfile) {
      firstName = user.adminProfile.firstName;
      lastName = user.adminProfile.lastName;
    } else if (user.patientProfile) {
      firstName = user.patientProfile.firstName;
      lastName = user.patientProfile.lastName;
    } else if (user.careManagerProfile) {
      firstName = user.careManagerProfile.firstName;
      lastName = user.careManagerProfile.lastName;
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
      firstName,
      lastName,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Forbidden: Role '${req.user.role}' does not have permission to access this resource. Required: [${allowedRoles.join(', ')}]`
        )
      );
    }

    next();
  };
};

// Role-specific convenience guards
export const requireAdmin = [authenticate, authorize(Role.ADMIN)];
export const requirePatient = [authenticate, authorize(Role.PATIENT)];
export const requireCareManager = [authenticate, authorize(Role.CARE_MANAGER)];
export const requireCareManagerOrAdmin = [authenticate, authorize(Role.ADMIN, Role.CARE_MANAGER)];
export const requireAnyAuthenticatedUser = [authenticate];
