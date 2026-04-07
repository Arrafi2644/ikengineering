import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from '@/utils/catchAsync';
import AppError from '@/errorHelpers/appError';
import { sendResponse } from '@/utils/sendResponse';
import { cloudinaryUpload, deleteImageFromCloudinary } from '@/config/cloudinary.config';
import { HeroServices } from '@/services/hero.service';
import { Hero } from '@/models/hero.model';
import { IHero } from '@/interfaces/Hero.interface';

const createHero = catchAsync(async (req: Request, res: Response) => {

    console.log("Hero controller , ", req.body)

    const payload: IHero = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    }
    const result = await HeroServices.createHero(payload);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Hero created successfully',
        data: result
    });
});

const updateHero = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const heroId = req.params.id as string;
        const payload = req.body;

        // Find existing product
        const existingProduct = await Hero.findById(heroId);

        if (!existingProduct) {
            throw new AppError(httpStatus.NOT_FOUND, "Hero not found");
        }

        // If new images uploaded
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const newImages = (req.files as Express.Multer.File[]).map(
                (file) => file.path
            );

            // delete old images
            if (existingProduct.images?.length && newImages.length < existingProduct.images.length) {
                await Promise.all(
                    existingProduct.images.map((img) =>
                        deleteImageFromCloudinary(img)
                    )
                );
            }

            payload.images = newImages;
        }

        const product = await HeroServices.updateHero(heroId, payload);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Hero Updated Successfully",
            data: product,
        });
    }
);

const getSingleHero = catchAsync(async (req: Request, res: Response) => {

    // const heroId = req.params.id as string;
    const result = await HeroServices.getSingleHero();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Hero retrieved successfully',
        data: result
    });
});


export const HeroControllers = {
    createHero,
    getSingleHero,
    updateHero
}