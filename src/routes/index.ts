import { Router } from 'express';
import authRoutes from './auth.routes.js';
import patientRoutes from './patient.routes.js';
import careManagerRoutes from './careManager.routes.js';
import providerRoutes from './provider.routes.js';
import caseRoutes from './case.routes.js';
import auditLogRoutes from './auditLog.routes.js';
import { auditLogger } from '../middlewares/audit.middleware.js';

const router = Router();

// Global Audit Middleware intercepting all API v1 mutations
router.use(auditLogger);

// Sub-routers mounted under /api/v1
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/care-managers', careManagerRoutes);
router.use('/providers', providerRoutes);
router.use('/cases', caseRoutes);
router.use('/audit-logs', auditLogRoutes);

export default router;
