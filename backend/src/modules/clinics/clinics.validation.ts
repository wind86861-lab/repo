import { z } from 'zod';

const ClinicType = z.enum(['GENERAL', 'SPECIALIZED', 'DIAGNOSTIC', 'DENTAL', 'MATERNITY', 'REHABILITATION', 'PHARMACY', 'OTHER']);
const ClinicStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'BLOCKED']);

const workingHourSchema = z.object({
    day: z.string(),
    isOpen: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
});

export const clinicCreateSchema = z.object({
    body: z.object({
        nameUz: z.string().min(3).max(255),
        nameRu: z.string().max(255).optional().nullable(),
        nameEn: z.string().max(255).optional().nullable(),
        type: ClinicType.optional(),
        description: z.string().optional().nullable(),
        logo: z.string().url().optional().nullable(),
        coverImage: z.string().url().optional().nullable(),

        // Location
        region: z.string().min(1),
        district: z.string().min(1),
        street: z.string().min(1),
        apartment: z.string().optional().nullable(),
        landmark: z.string().optional().nullable(),
        latitude: z.number().optional().nullable(),
        longitude: z.number().optional().nullable(),

        // Contact
        phones: z.array(z.string()).min(1),
        emails: z.array(z.string().email()).min(1),
        website: z.string().url().optional().nullable(),
        socialMedia: z.any().optional().nullable(),

        // Schedule
        workingHours: z.array(workingHourSchema).min(1),
        hasEmergency: z.boolean().optional(),
        hasAmbulance: z.boolean().optional(),
        hasOnlineBooking: z.boolean().optional(),

        // Infrastructure
        bedsCount: z.number().int().min(0).optional().nullable(),
        floorsCount: z.number().int().min(0).optional().nullable(),
        parkingAvailable: z.boolean().optional(),
        amenities: z.any().optional().nullable(),

        // Payment
        paymentMethods: z.any().optional().nullable(),
        insuranceAccepted: z.any().optional().nullable(),
        priceRange: z.string().optional().nullable(),

        // Documents
        registrationNumber: z.string().min(1),
        taxId: z.string().min(1),
        licenseNumber: z.string().min(1),
        licenseIssuedAt: z.string().optional().nullable(),
        licenseExpiresAt: z.string().optional().nullable(),
        licenseIssuedBy: z.string().optional().nullable(),

        // Admin
        adminFirstName: z.string().min(1),
        adminLastName: z.string().min(1),
        adminEmail: z.string().email(),
        adminPhone: z.string().min(1),
        adminPosition: z.string().optional().nullable(),

        notes: z.string().optional().nullable(),
    }),
});

export const clinicUpdateSchema = z.object({
    body: z.object({
        nameUz: z.string().min(3).max(255).optional(),
        nameRu: z.string().max(255).optional().nullable(),
        type: ClinicType.optional(),
        description: z.string().optional().nullable(),
        logo: z.string().url().optional().nullable(),
        coverImage: z.string().url().optional().nullable(),
        region: z.string().optional(),
        district: z.string().optional(),
        street: z.string().optional(),
        apartment: z.string().optional().nullable(),
        landmark: z.string().optional().nullable(),
        latitude: z.number().optional().nullable(),
        longitude: z.number().optional().nullable(),
        phones: z.array(z.string()).optional(),
        emails: z.array(z.string().email()).optional(),
        website: z.string().url().optional().nullable(),
        socialMedia: z.any().optional().nullable(),
        workingHours: z.array(workingHourSchema).optional(),
        hasEmergency: z.boolean().optional(),
        hasAmbulance: z.boolean().optional(),
        hasOnlineBooking: z.boolean().optional(),
        bedsCount: z.number().optional().nullable(),
        floorsCount: z.number().optional().nullable(),
        parkingAvailable: z.boolean().optional(),
        amenities: z.any().optional().nullable(),
        paymentMethods: z.any().optional().nullable(),
        insuranceAccepted: z.any().optional().nullable(),
        priceRange: z.string().optional().nullable(),
        registrationNumber: z.string().optional(),
        taxId: z.string().optional(),
        licenseNumber: z.string().optional(),
        licenseIssuedAt: z.string().optional().nullable(),
        licenseExpiresAt: z.string().optional().nullable(),
        licenseIssuedBy: z.string().optional().nullable(),
        adminFirstName: z.string().optional(),
        adminLastName: z.string().optional(),
        adminEmail: z.string().email().optional(),
        adminPhone: z.string().optional(),
        adminPosition: z.string().optional().nullable(),
        notes: z.string().optional().nullable(),
    }),
});

export const clinicStatusSchema = z.object({
    body: z.object({
        status: ClinicStatus,
        rejectionReason: z.string().optional().nullable(),
    }),
});
