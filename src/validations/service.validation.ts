
import { z } from "zod";

/* ================= Feature ================= */
const featureZodSchema = z.object({
    title: z.string().optional()
});

/* ================= CREATE SERVICE ================= */
export const createServiceZodSchema = z.object({
    title: z.string().min(1),
    slug: z
        .string()
        .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers and hyphens")
        .optional(),
    serviceIcon: z.string().optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    shortDescription: z.string().min(1),
    features: z.array(featureZodSchema).nonempty().optional(),
});

/* ================= UPDATE SERVICE ================= */
export const updateServiceZodSchema = z.object({
    title: z.string().min(2).optional(),
    slug: z
        .string()
        .regex(/^[a-z0-9-]+$/)
        .optional(),
    serviceIcon: z.string().optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    shortDescription: z.string().optional(),
    features: z.array(featureZodSchema).optional(),
});
