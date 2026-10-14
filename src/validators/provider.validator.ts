import { z } from 'zod';
import { ProviderType, ProviderStatus } from '@prisma/client';

export const createProviderSchema = z.object({
  name: z.string().min(2, 'Provider facility name is required'),
  type: z.nativeEnum(ProviderType, {
    errorMap: () => ({ message: 'Invalid provider type (HOSPITAL, LAB, CLINIC, AMBULANCE, PHARMACY)' }),
  }),
  status: z.nativeEnum(ProviderStatus).default(ProviderStatus.ACTIVE).optional(),
  licenseNumber: z.string().optional().nullable(),
  contactPerson: z.string().optional().nullable(),
  phone: z.string().min(7, 'Contact phone is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(4, 'Pincode is required'),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  operatingHours: z.string().optional().nullable(),
  rating: z.number().min(0).max(5).default(0).optional(),
});

export const updateProviderSchema = createProviderSchema.partial();

export const updateProviderStatusSchema = z.object({
  status: z.nativeEnum(ProviderStatus, {
    errorMap: () => ({ message: 'Status must be ACTIVE, PAUSED, or DEACTIVATED' }),
  }),
});

export type CreateProviderInput = z.infer<typeof createProviderSchema>;
export type UpdateProviderInput = z.infer<typeof updateProviderSchema>;
export type UpdateProviderStatusInput = z.infer<typeof updateProviderStatusSchema>;
