import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, meta?: any, message?: string, status = 200) => {
    return res.status(status).json({
        success: true,
        data,
        meta,
        message,
    });
};

export const sendError = (res: Response, message: string, code: string, details?: any, status = 500) => {
    return res.status(status).json({
        success: false,
        error: {
            code,
            message,
            details,
        },
    });
};
