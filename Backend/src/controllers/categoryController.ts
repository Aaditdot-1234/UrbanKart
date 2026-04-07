import AppDataSource from "../datasource";
import { Categories } from "../entities/Categories";
import { Products } from "../entities/Products";
import { SubCategories } from "../entities/SubCategories";
import { Types } from "../entities/Types";
import { asyncHandler } from "../errors/asyncHandler";
import { NextFunction, Request, Response } from "express";

export class CategoryController {
    static filterProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const skip = (page - 1) * limit;

        const { name, minPrice, maxPrice, typeId } = req.query as { name?: string, minPrice?: number, maxPrice?: number, typeId?: string };
        const qb = AppDataSource.getRepository(Products).createQueryBuilder("product");

        qb.leftJoinAndSelect("product.subCategories", "subCategory")
            .leftJoinAndSelect("subCategory.categories", "category")
            .leftJoinAndSelect("category.types", "type")
            .where("product.is_deleted = :is_deleted", { is_deleted: false })

        if (name) {
            qb.andWhere("category.category_name LIKE :name OR subCategory.subcategory_name LIKE :name OR type.type_name LIKE :name OR product.product_name LIKE :name", { name: `%${name}%` });
        }
        if (minPrice) {
            qb.andWhere("product.product_price >= :minPrice", { minPrice: Number(minPrice) })
        }
        if (maxPrice) {
            qb.andWhere("product.product_price <= :maxPrice", { maxPrice: Number(maxPrice) })
        }
        if (typeId) {
            qb.andWhere("type.type_id LIKE :typeId", { typeId: Number(typeId) })
        }

        qb.skip(skip).take(limit);

        const [products, total] = await qb.getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({message: 'Products filtered successfully.', products, meta: {
            totalItems: total,
            itemCount: products.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }});
    })

    static getAllCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const categoryRepo = AppDataSource.getRepository(Categories);
        const [categories, total] = await categoryRepo.findAndCount({
            skip: skip,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        res.status(200).json({message: 'Categories fetched successfully', categories, meta: {
            totalItems: total,
            itemCount: categories.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }});
    })

    static getAllSubCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const skip = (page - 1) * limit;

        const subCategoryRepo = AppDataSource.getRepository(SubCategories);
        const [subCategories, total] = await subCategoryRepo.findAndCount({
            skip: skip,
            take: limit
        });
        
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({message: 'Subcategories fetched successfully', subCategories, meta: {
            totalItems: total,
            itemCount: subCategories.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }});
    })

    static getAllTypes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const typeRepo = AppDataSource.getRepository(Types);
        const types = await typeRepo.find();
        res.status(200).json({message: 'Types fetched successfully', types});
    })

    static getCategoryByProduct = asyncHandler(async (req: Request<{ product_id: string }>, res: Response, next: NextFunction) => {
        const { product_id } = req.params;
        const productRepo = AppDataSource.getRepository(Products);
        const product = await productRepo.findOne({
            where: { product_id: +product_id },
            relations: ["subCategories", "subCategories.categories", "subCategories.categories.types"]
        });
        res.status(200).json({message: 'Category fetched successfully by product', product});
    })
}   