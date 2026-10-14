import { Router } from 'express';
import { CareManagerController } from '../controllers/careManager.controller.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createCareManagerSchema, updateCareManagerSchema } from '../validators/careManager.validator.js';

const router = Router();

// Protect all care manager management routes with ADMIN guard
router.use(requireAdmin);

/**
 * @openapi
 * /care-managers:
 *   get:
 *     summary: List Care Managers with duty availability, caseload, and search filters
 *     tags:
 *       - Care Managers
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
 *           default: 10
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Care Managers roster retrieved
 *   post:
 *     summary: Onboard a new Field Care Manager
 *     tags:
 *       - Care Managers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - firstName
 *               - lastName
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+919876500001"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: cm.priya@pranova.com
 *               firstName:
 *                 type: string
 *                 example: Priya
 *               lastName:
 *                 type: string
 *                 example: Sharma
 *               employeeCode:
 *                 type: string
 *                 example: "CM-2026-001"
 *               specialization:
 *                 type: string
 *                 example: Emergency Trauma & Triage
 *               licenseNumber:
 *                 type: string
 *                 example: "MED-RN-48192"
 *               assignedZone:
 *                 type: string
 *                 example: Bengaluru Central
 *     responses:
 *       201:
 *         description: Care Manager onboarded
 */
router.get('/', CareManagerController.list);
router.get('/:id', CareManagerController.getById);
router.post('/', validateRequest(createCareManagerSchema), CareManagerController.create);

/**
 * @openapi
 * /care-managers/{id}:
 *   patch:
 *     summary: Update Care Manager details or telemetry
 *     tags:
 *       - Care Managers
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
 *         description: Care Manager updated
 *   delete:
 *     summary: Deactivate Care Manager
 *     tags:
 *       - Care Managers
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
 *         description: Care Manager removed or deactivated
 */
router.patch('/:id', validateRequest(updateCareManagerSchema), CareManagerController.update);
router.delete('/:id', CareManagerController.delete);

export default router;
