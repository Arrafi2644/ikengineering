import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from '@/utils/catchAsync';
import AppError from '@/errorHelpers/appError';
import { IService } from '@/interfaces/service.interface';
import { createServiceZodSchema, updateServiceZodSchema } from '@/validations/service.validation';
import { ServiceServices } from '@/services/service.service';
import { sendResponse } from '@/utils/sendResponse';
import { Service } from '@/models/service.model';
import { deleteImageFromCloudinary } from '@/config/cloudinary.config';


const createService = catchAsync(async (req: Request, res: Response) => {
  //  Parse JSON data
  const data = req.body.data ? JSON.parse(req.body.data) : req.body;

  // Only allowed file (service image)
  const files = req.files as Record<string, Express.Multer.File[]> | undefined;
  const serviceImage = files?.serviceImage?.[0]?.path;
  if (!serviceImage) {
  throw new AppError(400, "Service image is required");
}

  //  Build payload (NO extra fields)
  const payload: IService = {
    title: data.title,
    image: serviceImage,
    serviceIcon: data.serviceIcon,
    shortDescription: data.shortDescription,
    features: data.features,
  };

  // Zod validation
  const parsed = createServiceZodSchema.safeParse(payload);
  if (!parsed.success) {
    throw new AppError(
      400,
      parsed.error.issues.map(i => `${i.path.join(".")} ${i.message}`).join(", ")
    );
  }

  // Save to DB
  const result = await ServiceServices.createService(parsed.data as IService);

  // Response
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Service created successfully!",
    data: result,
  });
});

const updateService = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    // ✅ FIX
    const payload = req.body.data
      ? JSON.parse(req.body.data)
      : req.body;

    const existingService = await Service.findById(id);

    if (!existingService) {
      throw new AppError(httpStatus.NOT_FOUND, "Service not found");
    }

    // ✅ Image update
    if (req.file) {
      const newImage = (req.file as any).path;

      if (existingService.image) {
        await deleteImageFromCloudinary(existingService.image);
      }

      payload.image = newImage;
    }

    const service = await ServiceServices.updateService(id as string, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service Updated Successfully",
      data: service,
    });
  }
);
const getSingleService = catchAsync(async (req: Request, res: Response) => {

    const serviceSlug = req.params.slug as string;
    const result = await ServiceServices.getSingleService(serviceSlug);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Service retrieved successfully',
        data: result
    });
});


const getAllServices = catchAsync(async (req: Request, res: Response) => {

    const query = req.query

    const result = await ServiceServices.getAllServices(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Services retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {

    const serviceId = req.params.id as string;
    const result = await ServiceServices.deleteService(serviceId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Service Deleted successfully',
        data: result
    });
});

export const ServiceControllers = {
    createService,
    getSingleService,
    updateService,
    getAllServices,
    deleteService
}