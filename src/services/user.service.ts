import httpStatus from 'http-status-codes';
import bcryptjs from "bcryptjs";
import { JwtPayload } from 'jsonwebtoken';
import { IUser, Role } from '@/interfaces/user.interface';
import { User } from '@/models/user.model';
import AppError from '@/errorHelpers/appError';
import { QueryBuilder } from '@/utils/QueryBuilder';
import { UsersSearchableFields } from '@/constants/user.constants';
import { envVars } from '@/config/env';


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


// const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

//     if (decodedToken.role === Role.EDITOR) {
//         if (userId !== decodedToken.userId) {
//             throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized")
//         }
//     }

//     if(decodedToken.role === Role.EDITOR){
//         if(payload.password){
//             throw new AppError(httpStatus.BAD_REQUEST, "You cannot update password.")
//         }
//     }

//     const ifUserExist = await User.findById(userId)

//     if (!ifUserExist) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found")
//     }

//     if (payload.role) {
//         if (payload.role === Role.ADMIN && decodedToken.role === Role.EDITOR) {
//             throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
//         }
//     }

//     const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

//     return newUpdatedUser;
// }

const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Editor Role Restrictions
    if (decodedToken.role === Role.EDITOR) {
        if (userId !== decodedToken.userId) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to update this user.");
        }

        if (payload.password) {
            throw new AppError(httpStatus.BAD_REQUEST, "You cannot update your password here.");
        }

        if (payload.role || payload.isActive || payload.isDeleted || payload.isVerified) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to modify these fields.");
        }
    }

    if (payload.password) {
        const hashedPassword = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
        payload.password = hashedPassword;
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
