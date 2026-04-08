import { ISiteInfo } from "@/interfaces/siteInfo.interface";
import mongoose, { Schema } from "mongoose";


const SiteInfoSchema = new mongoose.Schema<ISiteInfo>(
  {
    siteTitle: { type: String },
    siteTagline: { type: String },
    mainLogo: { type: String, required: true },
    faviconLogo: { type: String },
    footerLogo: { type: String, required: true },
    mainEmail: { type: String },
    supportEmail: { type: String },
    phone: { type: String },
    supportPhone: { type: String },
    address: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
  },
  { timestamps: true }
);

export const SiteInfo = mongoose.model<ISiteInfo>("SiteInfo", SiteInfoSchema);
