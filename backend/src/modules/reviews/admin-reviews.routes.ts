import { Router } from 'express';
import * as adminReviewsController from './admin-reviews.controller';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// All routes require SUPER_ADMIN
router.use(requireAuth, requireRole(['SUPER_ADMIN']));

// 22. Delete review (moderation)
router.delete('/:id', adminReviewsController.remove);

export default router;
