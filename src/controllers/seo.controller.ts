import httpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync';
import { SEOServices } from '@/services/seo.service';
import { sendResponse } from '@/utils/sendResponse';


// Get SEO info for a page
const getSinglePageSEO = catchAsync(async (req: Request, res: Response) => {
    const { pagePath } = req.params as { pagePath: string };
    const result = await SEOServices.getSinglePageSEO(pagePath);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SEO information retrieved successfully',
        data: result,
    });
});

// Create SEO info for a page
const createSEO = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await SEOServices.createSEO(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'SEO information created successfully',
        data: result,
    });
});

// Update SEO info for a page
// const updateSEO = catchAsync(async (req: Request, res: Response) => {
//     const payload = req.body;
//     const result = await SEOServices.updateSEO(payload);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'SEO information updated successfully',
//         data: result,
//     });
// });

const updateSEO = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };          
    const payload = req.body;            

    const result = await SEOServices.updateSEO(id, payload); 

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SEO information updated successfully',
        data: result,
    });
});


const deleteSEO = catchAsync(async (req: Request, res: Response) => {
    const { pagePath } = req.params as { pagePath: string };
    const result = await SEOServices.deleteSEO(pagePath);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SEO information deleted successfully',
        data: result,
    });
});

const getAllSeo = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const result = await SEOServices.getAllSeo(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "SEO data retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

export const SEOControllers = {
    getSinglePageSEO,
    createSEO,
    updateSEO,
    deleteSEO,
    getAllSeo
};
