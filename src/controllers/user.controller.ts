/* eslint-disable @typescript-eslint/no-unused-vars */

import { IUser } from "@/interfaces/user.interface";
import { UserServices } from "@/services/user.service";
import { catchAsync } from "@/utils/catchAsync";
import { sendResponse } from "@/utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUserService(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created Successfully",
        data: user

    })
})

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})


const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const result = await UserServices.getAllUser(query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
});


const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string
    const result = await UserServices.getSingleUser(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Retrieved Successfully",
        data: result.data
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    const payload: IUser = {
        ...req.body,
        picture: req.file?.path
    }

    const user = await UserServices.updateUser(userId, payload)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Updated Successfully",
        data: user
    })
})

const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string; 
    const result = await UserServices.deleteUser(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Deleted Successfully",
        data: result.data
    })
})

export const UserControllers = {
    createUser,
    getMe,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser
}