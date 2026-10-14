import { Role, ProviderType, ProviderStatus, CasePriority, CaseStatus } from '@prisma/client';

export interface BasePaginationQuery {
  page?: string;
  perPage?: string;
  sort?: string;
  order?: 'asc' | 'desc' | 'ASC' | 'DESC';
  q?: string;
  name?: string;
  phone?: string;
}

export interface PatientQueryFilter extends BasePaginationQuery {
  bloodGroup?: string;
  gender?: string;
}

export interface CareManagerQueryFilter extends BasePaginationQuery {
  isAvailable?: string | boolean;
  operationalZone?: string;
}

export interface ProviderQueryFilter extends BasePaginationQuery {
  type?: ProviderType;
  status?: ProviderStatus;
  city?: string;
}

export interface CaseQueryFilter extends BasePaginationQuery {
  caseNumber?: string;
  title?: string;
  priority?: CasePriority;
  status?: CaseStatus;
  careManagerId?: string;
  patientId?: string;
}

export interface AuditLogQueryFilter extends BasePaginationQuery {
  action?: string;
  actorEmail?: string;
  resource?: string;
  status?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}
