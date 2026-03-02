import { z } from 'zod';

export const serviceSchema = z.object({
    body: z.object({
        nameUz: z.string().min(3).max(255),
        nameRu: z.string().max(255).optional(),
        nameEn: z.string().max(255).optional(),
        categoryId: z.string().uuid(),
        shortDescription: z.string().max(200).optional(),
        fullDescription: z.string().optional(),
        priceRecommended: z.number().min(0),
        priceMin: z.number().min(0),
        priceMax: z.number().min(0),
        durationMinutes: z.number().min(1).max(1440),
        resultTimeHours: z.number().min(0.5).max(720),
        preparation: z.string().max(1000).optional(),
        contraindications: z.string().max(500).optional(),
        sampleType: z.string().max(100).optional(),
        imageUrl: z.string().url().optional(),
        isActive: z.boolean().optional(),
    }).refine(
        (data) => data.priceMin <= data.priceRecommended && data.priceRecommended <= data.priceMax,
        {
            message: 'Price validation: min <= recommended <= max',
            path: ['priceRecommended'],
        }
    ),
});

export const updateSchema = z.object({
    body: z.object({
        nameUz: z.string().min(3).max(255).optional(),
        nameRu: z.string().max(255).optional(),
        nameEn: z.string().max(255).optional(),
        categoryId: z.string().uuid().optional(),
        shortDescription: z.string().max(200).optional(),
        fullDescription: z.string().optional(),
        priceRecommended: z.number().min(0).optional(),
        priceMin: z.number().min(0).optional(),
        priceMax: z.number().min(0).optional(),
        durationMinutes: z.number().min(1).max(1440).optional(),
        resultTimeHours: z.number().min(0.5).max(720).optional(),
        preparation: z.string().max(1000).optional(),
        contraindications: z.string().max(500).optional(),
        sampleType: z.string().max(100).optional(),
        imageUrl: z.string().url().optional(),
        isActive: z.boolean().optional(),
    }),
});
