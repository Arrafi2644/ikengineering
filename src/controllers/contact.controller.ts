
import httpStatus from 'http-status-codes';
import { ContactFormServices } from "@/services/contact.service";
import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from '@/utils/sendResponse';
import { IContactFormData } from '@/interfaces/contact.interface';
import { contactFormSchema } from '@/validations/contact.validation';
import AppError from '@/errorHelpers/appError';

const contactForm = catchAsync(async (req: Request, res: Response) => {
    console.log("Request in contact controller ", req.files)
  //  Parse JSON data
  const data = req.body.data ? JSON.parse(req.body.data) : req.body;

  // Only allowed file (service image)
  const files = req.files as Record<string, Express.Multer.File[]> | undefined;
  const uploadSpec = files?.contactFile?.map(file => file.path) || [];
//   const uploadSpec = files?.contactFile?.[0]?.path;

  //  Build payload (NO extra fields)
  const payload: IContactFormData = {
    ...data,
    uploadSpec: uploadSpec,
  };
  
  // Zod validation
  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    throw new AppError(
      400,
      parsed.error.issues.map(i => `${i.path.join(".")} ${i.message}`).join(", ")
    );
  }

// Save to DB
  const result = await ContactFormServices.submitContactForm(parsed.data as IContactFormData);

  // Response
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Contact form submitted successfully!",
    data: result,
  });
});

const getSingleContactForm = catchAsync(async (req: Request, res: Response) => {
    const id: string = req.params.id as string;

    // Call service to get single form
    const result = await ContactFormServices.getSingleContactForm(id);

    // Send response
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Form fetched successfully",
        data: result,
    });
});

const getAllContactForms  = catchAsync(async (req: Request, res: Response) => {
   const query = req.query;

    const result = await ContactFormServices.getAllSubmittedFormData(query as Record<string, string>);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All forms data retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
})

const deleteContactForm = catchAsync(async (req: Request, res: Response) => {
    const id: string = req.params.id as string;

    const result = await ContactFormServices.deleteContactForm(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Form deleted successfully",
        data: result,
    });
});


export const ContactController = {  
    // submitContactForm,
    contactForm,
    getSingleContactForm,
    getAllContactForms,
    deleteContactForm
}