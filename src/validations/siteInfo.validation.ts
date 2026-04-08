import { z } from "zod";


// Create Schema - required fields must be present
export const createSiteInfoSchema = z.object({
  siteTitle: z.string().optional(),
  siteTagline: z.string().optional(),
  mainLogo: z.string(), 
  faviconLogo: z.string().optional(),
  footerLogo: z.string(), 

  supportEmail: z.string().email().optional(),
  mainEmail: z.string().email().optional(),
  phone: z.string().optional(),
  supportPhone: z.string().optional(),
  address: z.string().optional(),

  facebook: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  instagram: z.string().url().optional(),
});

// Update Schema - all fields optional
export const updateSiteInfoSchema = createSiteInfoSchema.partial();
