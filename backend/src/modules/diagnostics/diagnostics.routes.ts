import { Router } from 'express';
import * as diagnosticsController from './diagnostics.controller';
import { validate } from '../../middleware/validate.middleware';
import { serviceSchema, updateSchema } from './diagnostics.validation';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', diagnosticsController.list);
router.get('/:id', diagnosticsController.getById);

// Admin only routes
router.post(
    '/',
    requireAuth,
    requireRole(['SUPER_ADMIN']),
    validate(serviceSchema),
    diagnosticsController.create
);

router.put(
    '/:id',
    requireAuth,
    requireRole(['SUPER_ADMIN']),
    validate(updateSchema),
    diagnosticsController.update
);

router.delete(
    '/:id',
    requireAuth,
    requireRole(['SUPER_ADMIN']),
    diagnosticsController.remove
);

export default router;
