import { ProjectSearchableFields } from '@/constants/project.constants';
import { ServicesSearchableFields } from '@/constants/service.constants';
import AppError from '@/errorHelpers/appError';
import { IProject } from '@/interfaces/project.interface';
import { IService } from '@/interfaces/service.interface';
import { Project } from '@/models/project.model';
import { Service } from '@/models/service.model';
import { QueryBuilder } from '@/utils/QueryBuilder';
import httpStatus from 'http-status-codes';

// Project 
const createProject = async (payload: IProject) => {
    const existingProject = await Project.findOne({ name: payload.name });
    if (existingProject) {
        throw new Error("A project with this name already exists.");
    }

    const project = await Project.create(payload)

    return project;
};

const getSingleProject = async (id: string) => {

    const project = await Project.findById(id)

    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, "Project not found")
    }

    return project;
};

const updateProject = async (
    projectId: string,
    payload: Partial<IProject>
) => {
    const existingProject = await Project.findById(projectId);

    if (!existingProject) {
        throw new AppError(httpStatus.NOT_FOUND, "Project not found");
    }

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        payload,
        { new: true, runValidators: true }
    );

    return updatedProject;

};

const getAllProjects = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Project.find(), query)

    const projects = await queryBuilder
        .search(ProjectSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        projects.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};

const deleteProject = async (projectId: string) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, "Project not found");
    }

    await Project.findByIdAndDelete(projectId);

    return null;
};

export const ProjectServices = {
    createProject,
    getSingleProject,
    updateProject,
    getAllProjects,
    deleteProject
}