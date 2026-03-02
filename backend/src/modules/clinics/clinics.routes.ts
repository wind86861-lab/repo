import { Router } from 'express';
import * as clinicsController from './clinics.controller';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { clinicCreateSchema, clinicUpdateSchema, clinicStatusSchema } from './clinics.validation';

const router = Router();

// Public — anyone can view approved clinics
router.get('/', clinicsController.list);
router.get('/:id', clinicsController.getById);

// Auth required for creating/updating/deleting
router.post(
    '/',
    requireAuth,
    requireRole(['SUPER_ADMIN']),
    validate(clinicCreateSchema),
    clinicsController.create
);

router.put(
    '/:id',
    requireAuth,
    requireRole(['SUPER_ADMIN']),
    validate(clinicUpdateSchema),
    clinicsController.update
);

router.patch(
    '/:id/status',
    requireAuth,
    requireRole(['SUPER_ADMIN']),
    validate(clinicStatusSchema),
    clinicsController.updateStatus
);

router.delete(
    '/:id',
    requireAuth,
    requireRole(['SUPER_ADMIN']),
    clinicsController.remove
);

export default router;
