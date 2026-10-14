import { z } from 'zod';
import { CasePriority, CaseStatus, CaseTriggerSource } from '@prisma/client';

export const createCaseSchema = z.object({
  patientId: z.string().uuid('Valid patient ID is required'),
  priority: z.nativeEnum(CasePriority).default(CasePriority.P2),
  title: z.string().min(3, 'Case title is required'),
  description: z.string().optional().nullable(),
  triggerSource: z.nativeEnum(CaseTriggerSource).default(CaseTriggerSource.ADMIN_MANUAL),
  providerId: z.string().uuid('Valid provider ID is required').optional().nullable(),
  incidentAddress: z.string().optional().nullable(),
  incidentLatitude: z.number().optional().nullable(),
  incidentLongitude: z.number().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const assignCaseSchema = z.object({
  careManagerId: z.string().uuid('Valid Care Manager ID is required'),
  notes: z.string().optional().nullable(),
});

export const updateCaseStatusSchema = z.object({
  status: z.nativeEnum(CaseStatus),
  notes: z.string().optional().nullable(),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type AssignCaseInput = z.infer<typeof assignCaseSchema>;
export type UpdateCaseStatusInput = z.infer<typeof updateCaseStatusSchema>;
