import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/categories/categories.routes';
import diagnosticRoutes from './modules/diagnostics/diagnostics.routes';
import surgicalRoutes from './modules/surgical/surgical.routes';
import clinicRoutes from './modules/clinics/clinics.routes';
import adminClinicRoutes from './modules/clinics/admin-clinics.routes';
import adminReviewRoutes from './modules/reviews/admin-reviews.routes';
import checkupPackageRoutes, { adminCheckupPackageRoutes, clinicCheckupPackageRoutes } from './modules/checkup-packages/checkup-packages.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Logic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/diagnostics', diagnosticRoutes);
app.use('/api/surgical', surgicalRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/admin/clinics', adminClinicRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/checkup-packages', checkupPackageRoutes);
app.use('/api/admin/checkup-packages', adminCheckupPackageRoutes);
app.use('/api/clinic/checkup-packages', clinicCheckupPackageRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(errorHandler);

export default app;
