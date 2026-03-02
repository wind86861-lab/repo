import prisma from '../../config/database';
import { AppError, ErrorCodes } from '../../utils/errors';

export const listClinics = async (query: any) => {
    const { page = 1, limit = 10, search, status, region, type } = query;
    const skip = (Number(page) - 1) * Number(limit);

    let where: any = { isActive: true };
    if (status) where.status = status;
    if (region) where.region = { contains: region, mode: 'insensitive' };
    if (type) where.type = type;

    if (search && search.length >= 2) {
        where.OR = [
            { nameUz: { contains: search, mode: 'insensitive' } },
            { nameRu: { contains: search, mode: 'insensitive' } },
            { region: { contains: search, mode: 'insensitive' } },
            { district: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [clinics, total] = await Promise.all([
        prisma.clinic.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
        }),
        prisma.clinic.count({ where }),
    ]);

    return {
        clinics,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};

export const getClinicById = async (id: string) => {
    return prisma.clinic.findUnique({ where: { id } });
};

export const createClinic = async (data: any) => {
    // Parse dates if provided
    const parsed: any = { ...data };
    if (parsed.licenseIssuedAt) parsed.licenseIssuedAt = new Date(parsed.licenseIssuedAt);
    if (parsed.licenseExpiresAt) parsed.licenseExpiresAt = new Date(parsed.licenseExpiresAt);

    return prisma.clinic.create({ data: parsed });
};

export const updateClinic = async (id: string, data: any) => {
    const parsed: any = { ...data };
    if (parsed.licenseIssuedAt) parsed.licenseIssuedAt = new Date(parsed.licenseIssuedAt);
    if (parsed.licenseExpiresAt) parsed.licenseExpiresAt = new Date(parsed.licenseExpiresAt);

    return prisma.clinic.update({ where: { id }, data: parsed });
};

export const updateClinicStatus = async (id: string, status: string, rejectionReason?: string, approvedById?: string) => {
    const clinic = await prisma.clinic.findUnique({ where: { id } });
    if (!clinic) throw new AppError('Clinic not found', 404, ErrorCodes.NOT_FOUND);

    return prisma.clinic.update({
        where: { id },
        data: {
            status: status as any,
            ...(rejectionReason ? { rejectionReason } : {}),
            ...(status === 'APPROVED' && approvedById ? { approvedById } : {}),
        },
    });
};

export const deleteClinic = async (id: string) => {
    return prisma.clinic.update({ where: { id }, data: { isActive: false } });
};
