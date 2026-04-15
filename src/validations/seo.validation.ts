import { z } from "zod";

export const createSEOZodSchema = z.object({
  pagePath: z.string({
    required_error: "Page Path is required",
  }).min(1, "Page Path cannot be empty"),
  metaTitle: z.string({
    required_error: "Meta Title is required",
  }),
  metaDescription: z.string({
    required_error: "Meta Description is required",
  }),
  metaKeywords: z.string().optional(),

});

export const updateSEOZodSchema = z.object({
  metaTitle: z.string()
    .optional(),
  metaDescription: z.string()
    .optional(),
  metaKeywords: z.string().optional(),
});