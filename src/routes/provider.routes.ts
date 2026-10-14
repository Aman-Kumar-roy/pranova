import { Router } from 'express';
import { ProviderController } from '../controllers/provider.controller.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createProviderSchema,
  updateProviderSchema,
  updateProviderStatusSchema,
} from '../validators/provider.validator.js';

const router = Router();

// Protect all healthcare provider management routes with ADMIN guard
router.use(requireAdmin);

/**
 * @openapi
 * /providers:
 *   get:
 *     summary: List Healthcare Providers with type, status, and search filters
 *     tags:
 *       - Providers Directory
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [HOSPITAL, LAB, CLINIC, AMBULANCE, PHARMACY]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, PAUSED, DEACTIVATED]
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Providers list retrieved
 *   post:
 *     summary: Onboard a new Healthcare Provider facility
 *     tags:
 *       - Providers Directory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - phone
 *               - address
 *               - city
 *               - state
 *               - pincode
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apollo Speciality Hospital
 *               type:
 *                 type: string
 *                 enum: [HOSPITAL, LAB, CLINIC, AMBULANCE, PHARMACY]
 *               phone:
 *                 type: string
 *                 example: "+918023456789"
 *               address:
 *                 type: string
 *                 example: 154/11 Bannerghatta Road
 *               city:
 *                 type: string
 *                 example: Bengaluru
 *               state:
 *                 type: string
 *                 example: Karnataka
 *               pincode:
 *                 type: string
 *                 example: "560076"
 *     responses:
 *       201:
 *         description: Provider onboarded successfully
 */
router.get('/', ProviderController.list);
router.get('/:id', ProviderController.getById);
router.post('/', validateRequest(createProviderSchema), ProviderController.create);

/**
 * @openapi
 * /providers/{id}:
 *   patch:
 *     summary: Update Provider details
 *     tags:
 *       - Providers Directory
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
 *         description: Provider updated
 *   delete:
 *     summary: Deactivate / Delete Provider facility
 *     tags:
 *       - Providers Directory
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
 *         description: Provider removed or deactivated
 */
router.patch('/:id', validateRequest(updateProviderSchema), ProviderController.update);

/**
 * @openapi
 * /providers/{id}/status:
 *   patch:
 *     summary: Transition Provider status (ACTIVE / PAUSED / DEACTIVATED)
 *     tags:
 *       - Providers Directory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, PAUSED, DEACTIVATED]
 *     responses:
 *       200:
 *         description: Provider status transitioned
 */
router.patch('/:id/status', validateRequest(updateProviderStatusSchema), ProviderController.updateStatus);
router.delete('/:id', ProviderController.delete);

export default router;
