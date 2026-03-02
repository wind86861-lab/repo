import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.register(req.body);
        sendSuccess(res, user, null, 'Registration successful', 201);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body);
        sendSuccess(res, result, null, 'Login successful');
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        sendSuccess(res, null, null, 'Logout successful');
    } catch (error) {
        next(error);
    }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await authService.getMe(req.user!.id);
        sendSuccess(res, user);
    } catch (error) {
        next(error);
    }
};
