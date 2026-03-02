import { Response, NextFunction } from 'express';
import * as clinicsService from './clinics.service';
import { sendSuccess } from '../../utils/response';
import { AppError, ErrorCodes } from '../../utils/errors';
import { AuthRequest } from '../../middleware/auth.middleware';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await clinicsService.listClinics(req.query);
        sendSuccess(res, result.clinics, result.meta);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const clinic = await clinicsService.getClinicById(req.params.id as string);
        if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);
        sendSuccess(res, clinic);
    } catch (error) {
        next(error);
    }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const clinic = await clinicsService.createClinic(req.body);
        sendSuccess(res, clinic, null, 'Clinic created successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const clinic = await clinicsService.updateClinic(req.params.id as string, req.body);
        sendSuccess(res, clinic, null, 'Clinic updated successfully');
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { status, rejectionReason } = req.body;
        const clinic = await clinicsService.updateClinicStatus(
            req.params.id as string,
            status,
            rejectionReason,
            req.user?.id
        );
        sendSuccess(res, clinic, null, `Clinic ${status.toLowerCase()} successfully`);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await clinicsService.deleteClinic(req.params.id as string);
        sendSuccess(res, null, null, 'Clinic deleted successfully');
    } catch (error) {
        next(error);
    }
};
