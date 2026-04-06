import { z } from "zod";

export const HeroSchema = z.object({
  _id: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  shortDescription: z.string().optional(),
  // images: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// TypeScript type inference
export type IHero = z.infer<typeof HeroSchema>;