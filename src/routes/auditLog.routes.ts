import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLog.controller.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Immutable Audit Log Read-Only Endpoints (ADMIN Guarded)
router.use(requireAdmin);

/**
 * @openapi
 * /audit-logs:
 *   get:
 *     summary: Retrieve immutable compliance Audit Logs (Searchable & Filterable)
 *     tags:
 *       - Audit Logs & Compliance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 15
 *       - in: query
 *         name: resource
 *         schema:
 *           type: string
 *           example: Case
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           example: ASSIGN_CASE
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audit logs retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', AuditLogController.list);

/**
 * @openapi
 * /audit-logs/{id}:
 *   get:
 *     summary: Inspect individual immutable Audit Log transaction with payload snapshot
 *     tags:
 *       - Audit Logs & Compliance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Audit log transaction detail
 *       404:
 *         description: Audit log entry not found
 */
router.get('/:id', AuditLogController.getById);

export default router;
