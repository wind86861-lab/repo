import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import { env } from '../../config/env';
import { AppError, ErrorCodes } from '../../utils/errors';

export const register = async (userData: any) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
    });

    if (existingUser) {
        throw new AppError('Email already registered', 400, ErrorCodes.DUPLICATE_ERROR);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
        },
    });

    return user;
};

export const login = async (credentials: any) => {
    const user = await prisma.user.findUnique({
        where: { email: credentials.email },
    });

    if (!user || !user.isActive) {
        throw new AppError('Invalid credentials', 401, ErrorCodes.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

    if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401, ErrorCodes.UNAUTHORIZED);
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        env.JWT_SECRET as jwt.Secret,
        { expiresIn: '7d' } as jwt.SignOptions
    );

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
        token,
    };
};

export const getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
        },
    });

    if (!user) {
        throw new AppError('User not found', 404, ErrorCodes.NOT_FOUND);
    }

    return user;
};
