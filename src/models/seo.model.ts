import { ISEO } from "@/interfaces/seo.interface";
import { Schema, model } from "mongoose";

const SEOSchema = new Schema<ISEO>(
  {
    pagePath: { type: String, required: true, unique: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: String },
    // canonicalURL: { type: String, required: true },
    // ogTitle: { type: String },
    // ogDescription: { type: String },
    // ogImage: { type: String },
  },
  { timestamps: true }
);

export const SEO = model<ISEO>("SEO", SEOSchema);
