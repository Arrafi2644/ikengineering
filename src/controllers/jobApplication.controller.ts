import httpStatus from "http-status-codes";
import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "@/utils/sendResponse";
import { jobApplicationSchema } from "@/validations/jobApplication.validation";
import AppError from "@/errorHelpers/appError";
import { IJobApplication } from "@/interfaces/jobApplication.interface";
import { JobApplicationServices } from "@/services/jobApplication.service";

const submitJobApplication = catchAsync(async (req: Request, res: Response) => {
  console.log("📩 Job Application Request:", req.file);

  // JSON parse
  const data = req.body.data ? JSON.parse(req.body.data) : req.body;

  // file
  const file = req.file;

  // build payload
  const payload: IJobApplication = {
    ...data,
    cvFile: file?.path,
  };

  // validation
  const parsed = jobApplicationSchema.safeParse(payload);
  if (!parsed.success) {
    throw new AppError(
      400,
      parsed.error.issues.map(i => `${i.path.join(".")} ${i.message}`).join(", ")
    );
  }

  const result = await JobApplicationServices.submitJobApplication(parsed.data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Application submitted successfully!",
    data: result,
  });
});

const getSingleJobApplication = catchAsync(async (req: Request, res: Response) => {
    const id: string = req.params.id as string;

    // Call service to get single form
    const result = await JobApplicationServices.getSingleJobApplication(id);

    // Send response
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Form fetched successfully",
        data: result,
    });
});

const getAllJobApplications = catchAsync(async (req: Request, res: Response) => {
   const query = req.query;

    const result = await JobApplicationServices.getAllJobApplications(query as Record<string, string>);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All job applications retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
})

const deleteJobApplication = catchAsync(async (req: Request, res: Response) => {
    const id: string = req.params.id as string;

    const result = await JobApplicationServices.deleteJobApplication(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Job application deleted successfully",
        data: result,
    });
});

export const JobApplicationController = {
  submitJobApplication,
  getSingleJobApplication,
  getAllJobApplications,
  deleteJobApplication
};