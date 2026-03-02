import { Request, Response, NextFunction } from 'express';
import { checkupPackagesService } from './checkup-packages.service';
import { sendSuccess } from '../../utils/response';

export class CheckupPackagesController {

    // --- SUPER ADMIN ---

    createPackage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore - Assuming req.user is populated by requireAuth middleware
            const userId = req.user.id;
            const result = await checkupPackagesService.createPackage(req.body, userId);
            sendSuccess(res, result, null, 'Paket muvaffaqiyatli yaratildi', 201);
        } catch (error) {
            next(error);
        }
    };

    updatePackage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await checkupPackagesService.updatePackage(req.params.id as string, req.body);
            sendSuccess(res, result, null, 'Paket muvaffaqiyatli yangilandi');
        } catch (error) {
            next(error);
        }
    };

    deletePackage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await checkupPackagesService.deletePackage(req.params.id as string);
            sendSuccess(res, null, null, 'Paket muvaffaqiyatli o\'chirildi');
        } catch (error) {
            next(error);
        }
    };

    adminActivatePackage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await checkupPackagesService.togglePackageStatus(req.params.id as string, true);
            sendSuccess(res, result, null, 'Paket faollashtirildi');
        } catch (error) {
            next(error);
        }
    };

    adminDeactivatePackage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await checkupPackagesService.togglePackageStatus(req.params.id as string, false);
            sendSuccess(res, result, null, 'Paket nofaol qilindi');
        } catch (error) {
            next(error);
        }
    };

    getAdminPackages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { items, meta } = await checkupPackagesService.getAllPackages(req.query);
            sendSuccess(res, items, meta);
        } catch (error) {
            next(error);
        }
    };

    getAdminPackageById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await checkupPackagesService.getPackageWithServices(req.params.id as string);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    };

    // --- CLINIC ADMIN ---

    getClinicAvailablePackages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const clinicId = req.user.clinicId;
            const result = await checkupPackagesService.getClinicAvailablePackages(clinicId);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    };

    getClinicActivatedPackages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const clinicId = req.user.clinicId;
            const result = await checkupPackagesService.getClinicActivatedPackages(clinicId);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    };

    activateClinicPackage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const clinicId = req.user.clinicId;
            const result = await checkupPackagesService.activateClinicPackage(clinicId, req.body);
            sendSuccess(res, result, null, 'Paket faollashtirildi', 201);
        } catch (error) {
            next(error);
        }
    };

    updateClinicPackage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const clinicId = req.user.clinicId;
            const result = await checkupPackagesService.updateClinicPackage(req.params.id as string, clinicId, req.body);
            sendSuccess(res, result, null, 'Paket narxi yangilandi');
        } catch (error) {
            next(error);
        }
    };

    deactivateClinicPackage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const clinicId = req.user.clinicId;
            await checkupPackagesService.deactivateClinicPackage(req.params.id as string, clinicId);
            sendSuccess(res, null, null, 'Paket nofaol qilindi');
        } catch (error) {
            next(error);
        }
    };

    // --- PUBLIC ---

    getPublicCheckupPackages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await checkupPackagesService.getPublicPackages(req.query);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    };

    getPublicCheckupPackageById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await checkupPackagesService.getPublicPackageById(req.params.id as string);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    };
}

export const checkupPackagesController = new CheckupPackagesController();
