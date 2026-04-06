import { ServicesSearchableFields } from '@/constants/service.constants';
import AppError from '@/errorHelpers/appError';
import { IService } from '@/interfaces/service.interface';
import { Service } from '@/models/service.model';
import { QueryBuilder } from '@/utils/QueryBuilder';
import httpStatus from 'http-status-codes';

// Service 
const createService = async (payload: IService) => {
    const existingService = await Service.findOne({ title: payload.title });
    if (existingService) {
        throw new Error("A service with this title already exists.");
    }

    const service = await Service.create(payload)

    return service;
};

const getSingleService = async (serviceSlug: string) => {

    const service = await Service.findOne({slug: serviceSlug})

    if (!service) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found")
    }

    return service;
};

const updateService = async (
    serviceId: string,
    payload: Partial<IService>
) => {
    const existingService = await Service.findById(serviceId);

    if (!existingService) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found");
    }

    const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        payload,
        { new: true, runValidators: true }
    );

    return updatedService;

};

const getAllServices = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Service.find(), query)

    const services = await queryBuilder
        .search(ServicesSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        services.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};

const deleteService = async (serviceId: string) => {
    const service = await Service.findById(serviceId);

    if (!service) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found");
    }

    await service.deleteOne();

    return null;
};

export const ServiceServices = {
    createService,
    getSingleService,
    updateService,
    getAllServices,
    deleteService
}