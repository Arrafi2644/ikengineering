import z from "zod";

export const createProjectZodSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    type: z.string().min(1),
    image: z.string().url("Image must be a valid URL").optional(),
    duration: z.string().min(1),
    workers: z.string().min(1),
    value: z.string().min(1),
    });

    export const updateProjectZodSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    type: z.string().min(1).optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    duration: z.string().min(1).optional(),
    workers: z.string().min(1).optional(),
    value: z.string().min(1).optional(),
    });