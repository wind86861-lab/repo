import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { checkupPackagesController } from './checkup-packages.controller';
import {
    createCheckupPackageSchema,
    updateCheckupPackageSchema,
    activateClinicPackageSchema,
    updateClinicPackageSchema
} from './checkup-packages.validation';

const router = Router();

// PUBLIC ROUTES
// GET /api/checkup-packages?clinicId=...
router.get('/', checkupPackagesController.getPublicCheckupPackages);
// GET /api/checkup-packages/:id
router.get('/:id', checkupPackagesController.getPublicCheckupPackageById);

export default router;

export const adminCheckupPackageRoutes = Router();
// SUPER ADMIN ROUTES
adminCheckupPackageRoutes.use(requireAuth, requireRole(['SUPER_ADMIN']));
adminCheckupPackageRoutes.get('/', checkupPackagesController.getAdminPackages);
adminCheckupPackageRoutes.get('/:id', checkupPackagesController.getAdminPackageById);
adminCheckupPackageRoutes.post('/', validate(createCheckupPackageSchema), checkupPackagesController.createPackage);
adminCheckupPackageRoutes.put('/:id', validate(updateCheckupPackageSchema), checkupPackagesController.updatePackage);
adminCheckupPackageRoutes.delete('/:id', checkupPackagesController.deletePackage);
adminCheckupPackageRoutes.patch('/:id/activate', checkupPackagesController.adminActivatePackage);
adminCheckupPackageRoutes.patch('/:id/deactivate', checkupPackagesController.adminDeactivatePackage);

export const clinicCheckupPackageRoutes = Router();
// CLINIC ROUTES
clinicCheckupPackageRoutes.use(requireAuth, requireRole(['CLINIC_ADMIN']));
clinicCheckupPackageRoutes.get('/available', checkupPackagesController.getClinicAvailablePackages);
clinicCheckupPackageRoutes.get('/', checkupPackagesController.getClinicActivatedPackages);
clinicCheckupPackageRoutes.post('/activate', validate(activateClinicPackageSchema), checkupPackagesController.activateClinicPackage);
clinicCheckupPackageRoutes.patch('/:id', validate(updateClinicPackageSchema), checkupPackagesController.updateClinicPackage);
clinicCheckupPackageRoutes.patch('/:id/deactivate', checkupPackagesController.deactivateClinicPackage);
