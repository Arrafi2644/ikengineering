import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from '@/utils/catchAsync';
import AppError from '@/errorHelpers/appError';
import { sendResponse } from '@/utils/sendResponse';
import { deleteImageFromCloudinary } from '@/config/cloudinary.config';
import { IProject } from '@/interfaces/project.interface';
import { createProjectZodSchema } from '@/validations/project.validation';
import { ProjectServices } from '@/services/project.service';
import { Project } from '@/models/project.model';


const createProject = catchAsync(async (req: Request, res: Response) => {
  const data = req.body.data ? JSON.parse(req.body.data) : req.body;
   console.log("project controller ", data)
  const files = req.files as Record<string, Express.Multer.File[]> | undefined;
  const projectImage = files?.projectImage?.[0]?.path;
  if (!projectImage) {
  throw new AppError(400, "Project image is required");
}

  //  Build payload (NO extra fields)
  const payload: IProject = {
    name: data.name,
    image: projectImage,
    description: data.description,
    type: data.type,
    duration: data.duration,
    workers: data.workers,
    value: data.value,
  };

  // Zod validation
  const parsed = createProjectZodSchema.safeParse(payload);
  if (!parsed.success) {
    throw new AppError(
      400,
      parsed.error.issues.map(i => `${i.path.join(".")} ${i.message}`).join(", ")
    );
  }

  // Save to DB
  const result = await ProjectServices.createProject(parsed.data as IProject);

  // Response
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Project created successfully!",
    data: result,
  });
});

const updateProject = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    // ✅ FIX
    const payload = req.body.data
      ? JSON.parse(req.body.data)
      : req.body;

    const existingProject = await Project.findById(id);

    if (!existingProject) {
      throw new AppError(httpStatus.NOT_FOUND, "Project not found");
    }

    // ✅ Image update
    if (req.file) {
      const newImage = (req.file as any).path;

      if (existingProject.image) {
        await deleteImageFromCloudinary(existingProject.image);
      }

      payload.image = newImage;
    }

    const project = await ProjectServices.updateProject(id as string, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Project Updated Successfully",
      data: project,
    });
  }
);
const getSingleProject = catchAsync(async (req: Request, res: Response) => {

    const projectSlug = req.params.slug as string;
    const result = await ProjectServices.getSingleProject(projectSlug);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project retrieved successfully',
        data: result
    });
});


const getAllProjects = catchAsync(async (req: Request, res: Response) => {

    const query = req.query

    const result = await ProjectServices.getAllProjects(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Projects retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {

    const projectId = req.params.id as string;
    const result = await ProjectServices.deleteProject(projectId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project Deleted successfully',
        data: result
    });
});

export const ProjectControllers = {
    createProject,
    getSingleProject,
    updateProject,
    getAllProjects,
    deleteProject
}