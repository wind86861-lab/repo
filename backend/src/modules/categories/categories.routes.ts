import { Router } from 'express';
import * as categoriesController from './categories.controller';
import { validate } from '../../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema, deleteCategorySchema } from './categories.validation';

const router = Router();

router.get('/', categoriesController.list);
router.post('/', validate(createCategorySchema), categoriesController.create);
router.get('/:id', categoriesController.getById);
router.put('/:id', validate(updateCategorySchema), categoriesController.update);
router.delete('/:id', validate(deleteCategorySchema), categoriesController.deleteCategory);

export default router;
