import { Response, NextFunction } from 'express';
import * as adminReviewsService from '../clinics/admin-clinics.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

// 22. Delete review (moderation)
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await adminReviewsService.deleteReview(req.params.id as string);
        sendSuccess(res, null, null, 'Review deleted successfully');
    } catch (error) {
        next(error);
    }
};
