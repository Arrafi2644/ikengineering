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

    const total = await Service.countDocuments();
    payload.order = total + 1;

    const service = await Service.create(payload)

    return service;
};

const getSingleService = async (serviceSlug: string) => {

    const service = await Service.findOne({ slug: serviceSlug })

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

    if (!query.sort) {
        query.sort = "order";
    }

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

const reorderServices = async (
    payload: { _id: string; order: number }[]
) => {
    const total = await Service.countDocuments();

    // ✅ all services are available check
    if (payload.length !== total) {
        throw new AppError(400, "All services must be included");
    }

    // ✅ duplicate check
    const orders = payload.map(item => item.order);
    const uniqueOrders = new Set(orders);

    if (orders.length !== uniqueOrders.size) {
        throw new AppError(400, "Duplicate order is not allowed");
    }

    // ✅ range check
    for (const order of orders) {
        if (order < 1 || order > total) {
            throw new AppError(400, "Invalid order value");
        }
    }

    // 🔥 bulk update
    const bulkOps = payload.map(item => ({
        updateOne: {
            filter: { _id: item._id },
            update: { $set: { order: item.order } }
        }
    }));

    await Service.bulkWrite(bulkOps);

    return null;
};

export const ServiceServices = {
    createService,
    getSingleService,
    updateService,
    getAllServices,
    deleteService,
    reorderServices
}