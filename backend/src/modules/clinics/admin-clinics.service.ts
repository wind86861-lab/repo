import prisma from '../../config/database';
import { AppError, ErrorCodes } from '../../utils/errors';
import { ClinicStatus } from '@prisma/client';

// 1. List clinics with filters, search, sort
export const listClinics = async (query: any) => {
    const { 
        page = 1, 
        limit = 10, 
        search, 
        status, 
        region, 
        type,
        minRating,
        sort = 'createdAt:desc'
    } = query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build where clause
    let where: any = {};
    
    // Filter by status
    if (status) where.status = status;
    
    // Filter by region
    if (region) where.region = { contains: region, mode: 'insensitive' };
    
    // Filter by type
    if (type) where.type = type;
    
    // Filter by minimum rating
    if (minRating) where.averageRating = { gte: parseFloat(minRating) };
    
    // Search by name or address
    if (search && search.length >= 2) {
        where.OR = [
            { nameUz: { contains: search, mode: 'insensitive' } },
            { nameRu: { contains: search, mode: 'insensitive' } },
            { region: { contains: search, mode: 'insensitive' } },
            { district: { contains: search, mode: 'insensitive' } },
        ];
    }
    
    // Parse sort
    const [sortField, sortOrder] = sort.split(':');
    const orderBy: any = {};
    
    // Handle special sort cases
    if (sortField === 'appointments') {
        // Sort by appointment count will be handled after fetching
        orderBy.createdAt = sortOrder === 'desc' ? 'desc' : 'asc';
    } else if (sortField === 'rating') {
        orderBy.averageRating = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
        orderBy[sortField] = sortOrder === 'desc' ? 'desc' : 'asc';
    }
    
    const [clinics, total] = await Promise.all([
        prisma.clinic.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy,
            include: {
                _count: {
                    select: {
                        appointments: true,
                        doctors: true,
                        reviews: true,
                    }
                }
            }
        }),
        prisma.clinic.count({ where })
    ]);
    
    // Sort by appointment count if requested
    let sortedClinics = clinics;
    if (sortField === 'appointments') {
        sortedClinics = clinics.sort((a: any, b: any) => {
            const aCount = a._count.appointments;
            const bCount = b._count.appointments;
            return sortOrder === 'desc' ? bCount - aCount : aCount - bCount;
        });
    }
    
    return {
        clinics: sortedClinics,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};

// 2. Get clinic by ID
export const getClinicById = async (id: string) => {
    const clinic = await prisma.clinic.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    appointments: true,
                    doctors: true,
                    reviews: true,
                }
            }
        }
    });
    
    if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);
    
    return clinic;
};

// 3. Create clinic
export const createClinic = async (data: any, adminId: string) => {
    // Parse dates
    const parsed: any = { ...data };
    if (parsed.licenseIssuedAt) parsed.licenseIssuedAt = new Date(parsed.licenseIssuedAt);
    if (parsed.licenseExpiresAt) parsed.licenseExpiresAt = new Date(parsed.licenseExpiresAt);
    
    return prisma.clinic.create({
        data: {
            ...parsed,
            status: 'PENDING',
            approvedById: adminId,
        }
    });
};

// 4. Update clinic
export const updateClinic = async (id: string, data: any) => {
    const clinic = await prisma.clinic.findUnique({ where: { id } });
    if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);
    
    const parsed: any = { ...data };
    if (parsed.licenseIssuedAt) parsed.licenseIssuedAt = new Date(parsed.licenseIssuedAt);
    if (parsed.licenseExpiresAt) parsed.licenseExpiresAt = new Date(parsed.licenseExpiresAt);
    
    return prisma.clinic.update({
        where: { id },
        data: parsed
    });
};

// 5. Soft delete (deactivate)
export const deleteClinic = async (id: string) => {
    const clinic = await prisma.clinic.findUnique({ where: { id } });
    if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);
    
    return prisma.clinic.update({
        where: { id },
        data: { isActive: false }
    });
};

// 6 & 7. Set active status
export const setActiveStatus = async (id: string, isActive: boolean) => {
    const clinic = await prisma.clinic.findUnique({ where: { id } });
    if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);
    
    return prisma.clinic.update({
        where: { id },
        data: { isActive }
    });
};

// 8 & 9. Update clinic status (approve/reject)
export const updateClinicStatus = async (
    id: string, 
    status: string, 
    rejectionReason?: string,
    approvedById?: string
) => {
    const clinic = await prisma.clinic.findUnique({ where: { id } });
    if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);
    
    return prisma.clinic.update({
        where: { id },
        data: {
            status: status as ClinicStatus,
            ...(rejectionReason && { rejectionReason }),
            ...(approvedById && status === 'APPROVED' && { approvedById }),
        }
    });
};

// 23 & 24. Bulk activate/deactivate
export const bulkSetActiveStatus = async (ids: string[], isActive: boolean) => {
    const result = await prisma.clinic.updateMany({
        where: { id: { in: ids } },
        data: { isActive }
    });
    
    return { count: result.count };
};

// 25. Export to CSV
export const exportClinicsToCSV = async (query: any) => {
    const { status, region, type } = query;
    
    let where: any = {};
    if (status) where.status = status;
    if (region) where.region = { contains: region, mode: 'insensitive' };
    if (type) where.type = type;
    
    const clinics = await prisma.clinic.findMany({ where });
    
    // CSV headers
    const headers = ['ID', 'Name (UZ)', 'Name (RU)', 'Type', 'Status', 'Region', 'District', 'Phone', 'Email', 'Rating', 'Reviews', 'Created At'];
    
    // CSV rows
    const rows = clinics.map(c => [
        c.id,
        c.nameUz,
        c.nameRu || '',
        c.type,
        c.status,
        c.region,
        c.district,
        (c.phones as string[]).join(', '),
        (c.emails as string[]).join(', '),
        c.averageRating,
        c.reviewCount,
        c.createdAt.toISOString()
    ]);
    
    // Generate CSV
    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    return csv;
};

// ─── Nested Resources ─────────────────────────────────────────────────────────

// 18. Get clinic services
export const getClinicServices = async (clinicId: string) => {
    const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });
    if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);
    
    const [diagnosticServices, surgicalServices] = await Promise.all([
        prisma.clinicDiagnosticService.findMany({
            where: { clinicId, isActive: true },
            include: { diagnosticService: true }
        }),
        prisma.clinicSurgicalService.findMany({
            where: { clinicId, isActive: true },
            include: { surgicalService: true }
        })
    ]);
    
    return {
        diagnostic: diagnosticServices.map(s => s.diagnosticService),
        surgical: surgicalServices.map(s => s.surgicalService)
    };
};

// 19. Get clinic doctors
export const getClinicDoctors = async (clinicId: string) => {
    const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });
    if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);
    
    return prisma.doctor.findMany({
        where: { clinicId, isActive: true },
        orderBy: { createdAt: 'desc' }
    });
};

// 20. Get clinic statistics
export const getClinicStats = async (clinicId: string) => {
    const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });
    if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);
    
    const [
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        totalRevenue,
        avgRating
    ] = await Promise.all([
        prisma.appointment.count({ where: { clinicId } }),
        prisma.appointment.count({ where: { clinicId, status: 'COMPLETED' } }),
        prisma.appointment.count({ where: { clinicId, status: 'PENDING' } }),
        prisma.appointment.aggregate({
            where: { clinicId, status: 'COMPLETED' },
            _sum: { price: true }
        }),
        prisma.review.aggregate({
            where: { clinicId, isActive: true },
            _avg: { rating: true }
        })
    ]);
    
    return {
        appointments: {
            total: totalAppointments,
            completed: completedAppointments,
            pending: pendingAppointments,
        },
        revenue: totalRevenue._sum.price || 0,
        rating: {
            average: avgRating._avg.rating || 0,
            count: clinic.reviewCount
        },
        doctors: await prisma.doctor.count({ where: { clinicId } })
    };
};

// 21. Get clinic reviews
export const getClinicReviews = async (clinicId: string) => {
    const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });
    if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);
    
    return prisma.review.findMany({
        where: { clinicId, isActive: true },
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' }
    });
};

// 22. Delete review (moderation)
export const deleteReview = async (reviewId: string) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new AppError('Review not found', 404, ErrorCodes.NOT_FOUND);
    
    // Soft delete - just mark as inactive
    await prisma.review.update({
        where: { id: reviewId },
        data: { isActive: false }
    });
    
    // Recalculate clinic rating
    const clinicReviews = await prisma.review.findMany({
        where: { clinicId: review.clinicId, isActive: true }
    });
    
    const avgRating = clinicReviews.length > 0
        ? clinicReviews.reduce((sum, r) => sum + r.rating, 0) / clinicReviews.length
        : 0;
    
    await prisma.clinic.update({
        where: { id: review.clinicId },
        data: {
            averageRating: avgRating,
            reviewCount: clinicReviews.length
        }
    });
    
    return { success: true };
};
