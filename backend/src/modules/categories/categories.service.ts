import prisma from '../../config/database';

interface CategoryTreeNode {
    id: string;
    parentId: string | null;
    level: number;
    nameUz: string;
    nameRu: string | null;
    nameEn: string | null;
    slug: string;
    icon: string | null;
    sortOrder: number;
    children: CategoryTreeNode[];
    [key: string]: any;
}

export const getAllCategories = async (): Promise<CategoryTreeNode[]> => {
    const categories = await prisma.serviceCategory.findMany({
        orderBy: { sortOrder: 'asc' },
    });

    return buildTree(categories, null);
};

export const getCategoryById = async (id: string) => {
    return prisma.serviceCategory.findUnique({
        where: { id },
        include: {
            children: true,
        },
    });
};

const buildTree = (items: any[], parentId: string | null): CategoryTreeNode[] => {
    return items
        .filter((item: any) => item.parentId === parentId)
        .map((item: any) => ({
            ...item,
            children: buildTree(items, item.id),
        }));
};

export const createCategory = async (data: any) => {
    return prisma.serviceCategory.create({
        data,
    });
};

export const updateCategory = async (id: string, data: any) => {
    return prisma.serviceCategory.update({
        where: { id },
        data,
    });
};

export const deleteCategory = async (id: string) => {
    return prisma.serviceCategory.delete({
        where: { id },
    });
};
