import { z } from "zod";

export const createSEOZodSchema = z.object({
  pagePath: z.string({
    required_error: "Page Path is required",
  }).min(1, "Page Path cannot be empty"),
  metaTitle: z.string({
    required_error: "Meta Title is required",
  }).max(60, "Meta Title should be max 100 characters"),
  metaDescription: z.string({
    required_error: "Meta Description is required",
  }).max(160, "Meta Description should be max 200 characters"),
  metaKeywords: z.string().optional(),
  // canonicalURL: z.string({
  //   required_error: "Canonical URL is required",
  // }).url("Canonical URL must be a valid URL"),
  // ogTitle: z.string().optional(),
  // ogDescription: z.string().optional(),
  // ogImage: z
  //   .string()
  //   .optional()
  //   .refine(
  //     (val) => !val || /^https?:\/\/\S+$/.test(val),
  //     { message: "OG Image must be a valid URL" }
  //   ),

});

export const updateSEOZodSchema = z.object({
  metaTitle: z.string()
    .max(60, "Meta Title should be max 100 characters")
    .optional(),
  metaDescription: z.string()
    .max(160, "Meta Description should be max 200 characters")
    .optional(),
  metaKeywords: z.string().optional(),
//   canonicalURL: z.string()
//     .url("Canonical URL must be a valid URL")
//     .optional(),
//   ogTitle: z.string().optional(),
//   ogDescription: z.string().optional(),
//  ogImage: z
//   .string()
//   .optional()
//   .refine(
//     (val) => !val || /^https?:\/\/\S+$/.test(val),
//     { message: "OG Image must be a valid URL" }
//   ).optional(),
});