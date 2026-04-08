import AppError from "@/errorHelpers/appError";
import { ISiteInfo } from "@/interfaces/siteInfo.interface";
import { SiteInfo } from "@/models/siteinfo.model";

const getSiteInfo = async (): Promise<ISiteInfo | null> => {
    const siteInfo = await SiteInfo.findOne();
    return siteInfo;
};

// Create SiteInfo
const createSiteInfo = async (payload: ISiteInfo) => {
    // Optional: check if a SiteInfo already exists (singleton)
    const existing = await SiteInfo.findOne();
    if (existing) {
        throw new AppError(400, "Site information already exists. You can only update it.");
    }

    const siteInfo = await SiteInfo.create(payload);
    return siteInfo;
};

// Update SiteInfo
const updateSiteInfo = async (payload: Partial<ISiteInfo>) => {
  const updatedSiteInfo = await SiteInfo.findOneAndUpdate(
    {},
    payload,
    { new: true, runValidators: true }
  );

  if (!updatedSiteInfo) {
    throw new AppError(404, "Site information not found");
  }

  return updatedSiteInfo;
};


export const SiteInfoServices = {
    getSiteInfo,
    createSiteInfo,
    updateSiteInfo
};
