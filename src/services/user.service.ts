import httpStatus from 'http-status-codes';
import bcryptjs from "bcryptjs";
import { JwtPayload } from 'jsonwebtoken';
import { IUser, Role } from '@/interfaces/user.interface';
import { User } from '@/models/user.model';
import AppError from '@/errorHelpers/appError';
import { QueryBuilder } from '@/utils/QueryBuilder';
import { UsersSearchableFields } from '@/constants/user.constants';


const createUserService = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isExistUser = await User.findOne({ email })

    if (isExistUser) {
        throw new AppError(httpStatus.CONFLICT, "User already exist")
    }

    const hashPassword = await bcryptjs.hash(password as string, 10)
    const user = await User.create({
        email,
        password: hashPassword,
        ...rest
    })

    return user;

}

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

const getAllUser = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query);

    const users = await queryBuilder
        .search(UsersSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        users.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
};


const getSingleUser = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    return {
        data: user
    }
};

const deleteUser = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    await User.findByIdAndDelete(id);

    return {
        data: null
    }
};


const updateUser = async (
    userId: string,
    payload: Partial<IUser>
) => {
    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }


    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, 10);
    }
    
    // No restrictions for Admin — directly update
    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

    return updatedUser;
};


export const UserServices = {
    createUserService,
    getMe,
    getAllUser,
    deleteUser,
    getSingleUser,
    updateUser
}
