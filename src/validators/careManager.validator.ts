import { z } from 'zod';

export const createCareManagerSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits'),
  email: z.string().email('Invalid email address').optional().nullable(),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  employeeCode: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  licenseNumber: z.string().optional().nullable(),
  isAvailable: z.boolean().default(true).optional(),
  assignedZone: z.string().optional().nullable(),
  currentLatitude: z.number().optional().nullable(),
  currentLongitude: z.number().optional().nullable(),
});

export const updateCareManagerSchema = createCareManagerSchema.partial();

export type CreateCareManagerInput = z.infer<typeof createCareManagerSchema>;
export type UpdateCareManagerInput = z.infer<typeof updateCareManagerSchema>;
