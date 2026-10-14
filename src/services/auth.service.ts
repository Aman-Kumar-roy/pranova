import bcrypt from 'bcryptjs';
import { Role, UserStatus } from '@prisma/client';
import { prisma } from '../utils/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { JwtUtils } from '../utils/jwt.js';
import {
  AdminLoginInput,
  AdminRegisterInput,
  SendOtpInput,
  VerifyOtpInput,
} from '../validators/auth.validator.js';

export class AuthService {
  /**
   * Admin Login: Email + Password + JWT
   */
  static async adminLogin(input: AdminLoginInput) {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        adminProfile: true,
      },
    });

    if (!user || user.role !== Role.ADMIN) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw ApiError.forbidden(`Account is ${user.status.toLowerCase()}. Please contact system administration.`);
    }

    if (!user.passwordHash) {
      throw ApiError.unauthorized('Password authentication not configured for this administrator');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = JwtUtils.generateTokens({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.adminProfile?.firstName,
        lastName: user.adminProfile?.lastName,
        department: user.adminProfile?.department,
        mfaEnabled: user.adminProfile?.mfaEnabled,
      },
      tokens,
    };
  }

  /**
   * Admin Registration (Used for bootstrap and admin user creation)
   */
  static async adminRegister(input: AdminRegisterInput) {
    const { email, password, firstName, lastName, department } = input;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          role: Role.ADMIN,
          status: UserStatus.ACTIVE,
          isEmailVerified: true,
        },
      });

      const adminProfile = await tx.adminProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          department,
        },
      });

      return { ...user, adminProfile };
    });

    const tokens = JwtUtils.generateTokens({
      userId: newUser.id,
      role: newUser.role,
      email: newUser.email,
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.adminProfile.firstName,
        lastName: newUser.adminProfile.lastName,
        department: newUser.adminProfile.department,
      },
      tokens,
    };
  }

  /**
   * Send OTP for Patient or Care Manager mobile authentication
   * (Mocked: Always uses '123456')
   */
  static async sendOtp(input: SendOtpInput) {
    const { phone, role } = input;

    // Healthcare Pilot: OTP is mocked to accept '123456'
    // In production, dispatch via Twilio / Kaleyra / AWS SNS
    return {
      phone,
      role,
      mockOtp: '123456',
      expiresInSeconds: 300,
      message: 'OTP has been dispatched successfully. Use 123456 for testing.',
    };
  }

  /**
   * Verify OTP & Issue JWT (Auto-registers user and profile if first time)
   */
  static async verifyOtp(input: VerifyOtpInput) {
    const { phone, otp, role, firstName, lastName } = input;

    // Hard constraint: Mock OTP strictly accepts '123456'
    if (otp !== '123456') {
      throw ApiError.badRequest('Invalid OTP entered. Please provide valid 6-digit OTP');
    }

    let user = await prisma.user.findUnique({
      where: { phone },
      include: {
        patientProfile: true,
        careManagerProfile: true,
      },
    });

    if (!user) {
      // Auto-provision user & corresponding profile
      user = await prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            phone,
            role,
            status: UserStatus.ACTIVE,
            isPhoneVerified: true,
          },
        });

        if (role === Role.PATIENT) {
          await tx.patientProfile.create({
            data: {
              userId: createdUser.id,
              firstName: firstName || 'Patient',
              lastName: lastName || 'User',
            },
          });
        } else if (role === Role.CARE_MANAGER) {
          await tx.careManagerProfile.create({
            data: {
              userId: createdUser.id,
              firstName: firstName || 'Care',
              lastName: lastName || 'Manager',
              employeeCode: `CM-${Math.floor(1000 + Math.random() * 9000)}`,
              isAvailable: true,
            },
          });
        }

        return tx.user.findUniqueOrThrow({
          where: { id: createdUser.id },
          include: {
            patientProfile: true,
            careManagerProfile: true,
          },
        });
      });
    } else {
      // User exists - check role constraint
      if (user.role !== role) {
        throw ApiError.forbidden(
          `This phone number is registered as '${user.role}', cannot sign in as '${role}'`
        );
      }

      if (user.status !== UserStatus.ACTIVE) {
        throw ApiError.forbidden(`Account is ${user.status.toLowerCase()}. Access denied.`);
      }

      if (!user.isPhoneVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isPhoneVerified: true },
        });
      }
    }

    const tokens = JwtUtils.generateTokens({
      userId: user.id,
      role: user.role,
      phone: user.phone,
    });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        firstName:
          user.patientProfile?.firstName || user.careManagerProfile?.firstName,
        lastName:
          user.patientProfile?.lastName || user.careManagerProfile?.lastName,
        isPhoneVerified: true,
      },
      tokens,
    };
  }

  /**
   * Refresh Token: Issue new access & refresh token pair
   */
  static async refreshTokens(refreshToken: string) {
    const payload = JwtUtils.verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw ApiError.unauthorized('Invalid refresh session or inactive account');
    }

    const tokens = JwtUtils.generateTokens({
      userId: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
    });

    return { tokens };
  }

  /**
   * Get Current Authenticated User Profile
   */
  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        adminProfile: true,
        patientProfile: true,
        careManagerProfile: true,
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      profile:
        user.adminProfile || user.patientProfile || user.careManagerProfile || null,
      createdAt: user.createdAt,
    };
  }
}
