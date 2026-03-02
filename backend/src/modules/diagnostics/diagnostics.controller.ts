import { Response, NextFunction } from 'express';
import * as diagnosticsService from './diagnostics.service';
import { sendSuccess } from '../../utils/response';
import { AppError, ErrorCodes } from '../../utils/errors';
import { AuthRequest } from '../../middleware/auth.middleware';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await diagnosticsService.listServices(req.query);
        sendSuccess(res, result.services, result.meta);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const service = await diagnosticsService.getServiceById(id);
        if (!service) {
            throw new AppError('Service not found', 404, ErrorCodes.NOT_FOUND);
        }
        sendSuccess(res, service);
    } catch (error) {
        next(error);
    }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const service = await diagnosticsService.createService(req.body, req.user!.id);
        sendSuccess(res, service, null, 'Service created successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const service = await diagnosticsService.updateService(id, req.body);
        sendSuccess(res, service, null, 'Service updated successfully');
    } catch (error) {
        next(error);
    }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        await diagnosticsService.deleteService(id);
        sendSuccess(res, null, null, 'Service deactivated successfully');
    } catch (error) {
        next(error);
    }
};
