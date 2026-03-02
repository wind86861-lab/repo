import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCodes } from '../utils/errors';
import { sendError } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof AppError) {
        return sendError(res, err.message, err.code, err.details, err.statusCode);
    }

    // Handle Prisma errors
    if (err.code === 'P2002') {
        return sendError(res, 'Record already exists', ErrorCodes.DUPLICATE_ERROR, null, 409);
    }

    return sendError(res, 'Internal Server Error', ErrorCodes.SERVER_ERROR, null, 500);
};
