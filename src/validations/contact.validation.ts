import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),

  company: z
    .string()
    .optional(),

  projectType: z
    .string()
    .min(1, "Project type is required"),

  projectDetails: z
    .string()
    .min(10, "Project details must be at least 10 characters"),


  uploadSpec: z.array(z.string()).optional(),

  preferredContactTime: z
    .string()
    .optional(),
});


export const updateFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters").optional(),

  email: z
    .string()
    .email("Invalid email address").optional(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits").optional(),

  company: z
    .string()
    .optional(),

  projectType: z
    .string()
    .min(1, "Project type is required").optional(),

  projectDetails: z
    .string()
    .min(10, "Project details must be at least 10 characters").optional(),

  uploadSpec: z.array(z.string()).optional(),

  preferredContactTime: z
    .string()
    .optional(),
});