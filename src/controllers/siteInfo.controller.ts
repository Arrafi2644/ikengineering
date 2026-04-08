import { deleteImageFromCloudinary } from '@/config/cloudinary.config';
import AppError from '@/errorHelpers/appError';
import { ISiteInfo } from '@/interfaces/siteInfo.interface';
import { SiteInfo } from '@/models/siteinfo.model';
import { SiteInfoServices } from '@/services/siteInfo.service';
import { catchAsync } from '@/utils/catchAsync';
import { sendResponse } from '@/utils/sendResponse';
import { createSiteInfoSchema, updateSiteInfoSchema } from '@/validations/siteInfo.validation';
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

// Get site/admin info
const getSiteInfo = catchAsync(async (req: Request, res: Response) => {
    const result = await SiteInfoServices.getSiteInfo();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Site information retrieved successfully',
        data: result,
    });
});

// Create Site/Admin Info
export const createSiteInfo = catchAsync(async (req: Request, res: Response) => {
    // Parse JSON data
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;

    // File uploads
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const mainLogo = files?.mainLogo?.[0]?.path;
    const faviconLogo = files?.faviconLogo?.[0]?.path;
    const footerLogo = files?.footerLogo?.[0]?.path;

    if (!mainLogo || !footerLogo) {
        throw new AppError(400, "Main logo and Footer logo are required");
    }

    // Build payload
    const payload = {
        ...data,
        mainLogo,
        faviconLogo,
        footerLogo,
    };

    // Zod validation
    const parsed = createSiteInfoSchema.safeParse(payload);
    if (!parsed.success) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            parsed.error.issues.map(i => `${i.path.join(".")} ${i.message}`).join(", ")
        );
    }

    // Save to DB
    const result = await SiteInfoServices.createSiteInfo(parsed.data);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Site information created successfully",
        data: result,
    });
});

// Update Site/Admin Info
export const updateSiteInfo = catchAsync(async (req: Request, res: Response) => {
  const data = req.body.data ? JSON.parse(req.body.data) : req.body;

  const existingDoc = await SiteInfo.findOne();
  if (!existingDoc) {
    throw new AppError(httpStatus.NOT_FOUND, "Site information not found");
  }

  const files = req.files as Record<string, Express.Multer.File[]> | undefined;

  const payload: Partial<ISiteInfo> = {
    ...data,
  };

  if (files?.mainLogo?.[0]) {
    payload.mainLogo = files.mainLogo[0].path;
  }

  if (files?.faviconLogo?.[0]) {
    payload.faviconLogo = files.faviconLogo[0].path;
  }

  if (files?.footerLogo?.[0]) {
    payload.footerLogo = files.footerLogo[0].path;
  }

  // Zod validation (partial)
  const parsed = updateSiteInfoSchema.safeParse(payload);
  if (!parsed.success) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      parsed.error.issues.map(i => `${i.path.join(".")} ${i.message}`).join(", ")
    );
  }

  const updatedDoc = await SiteInfoServices.updateSiteInfo(parsed.data);

  // Delete old images only if replaced
  if (payload.mainLogo && existingDoc.mainLogo) {
    await deleteImageFromCloudinary(existingDoc.mainLogo);
  }

  if (payload.faviconLogo && existingDoc.faviconLogo) {
    await deleteImageFromCloudinary(existingDoc.faviconLogo);
  }

  if (payload.footerLogo && existingDoc.footerLogo) {
    await deleteImageFromCloudinary(existingDoc.footerLogo);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Site information updated successfully",
    data: updatedDoc,
  });
});


export const SiteInfoControllers = {
    getSiteInfo,
    createSiteInfo,
    updateSiteInfo,
};
