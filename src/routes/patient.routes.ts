import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createPatientSchema, updatePatientSchema } from '../validators/patient.validator.js';

const router = Router();

// Protect all patient management routes with ADMIN guard
router.use(requireAdmin);

/**
 * @openapi
 * /patients:
 *   get:
 *     summary: List Patients with search and demographic filters
 *     tags:
 *       - Patients
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
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patients list retrieved
 *   post:
 *     summary: Register a new Patient and clinical profile
 *     tags:
 *       - Patients
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
 *                 example: "+919876543210"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ananya.iyer@example.com
 *               firstName:
 *                 type: string
 *                 example: Ananya
 *               lastName:
 *                 type: string
 *                 example: Iyer
 *               bloodGroup:
 *                 type: string
 *                 example: "B+"
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *     responses:
 *       201:
 *         description: Patient created successfully
 */
router.get('/', PatientController.list);
router.get('/:id', PatientController.getById);
router.post('/', validateRequest(createPatientSchema), PatientController.create);

/**
 * @openapi
 * /patients/{id}:
 *   patch:
 *     summary: Update Patient record and medical profile
 *     tags:
 *       - Patients
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
 *         description: Patient updated
 *   delete:
 *     summary: Delete or deactivate Patient record
 *     tags:
 *       - Patients
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
 *         description: Patient removed
 */
router.patch('/:id', validateRequest(updatePatientSchema), PatientController.update);
router.delete('/:id', PatientController.delete);

export default router;
