import { Response, NextFunction } from 'express';
import * as categoriesService from './categories.service';
import { sendSuccess } from '../../utils/response';
import { AppError, ErrorCodes } from '../../utils/errors';
import { AuthRequest } from '../../middleware/auth.middleware';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const categories = await categoriesService.getAllCategories();
        sendSuccess(res, categories);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const category = await categoriesService.getCategoryById(id);
        if (!category) {
            throw new AppError('Category not found', 404, ErrorCodes.NOT_FOUND);
        }
        sendSuccess(res, category);
    } catch (error) {
        next(error);
    }
};
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const category = await categoriesService.createCategory(req.body);
        sendSuccess(res, category, null, 'Category created successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const category = await categoriesService.updateCategory(id, req.body);
        sendSuccess(res, category, null, 'Category updated successfully');
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        await categoriesService.deleteCategory(id);
        sendSuccess(res, null, null, 'Category deleted successfully');
    } catch (error) {
        next(error);
    }
};
