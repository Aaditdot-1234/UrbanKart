import AppDataSource from "../datasource";
import { Categories } from "../entities/Categories";
import { Products } from "../entities/Products";
import { SubCategories } from "../entities/SubCategories";
import { Types } from "../entities/Types";
import { asyncHandler } from "../errors/asyncHandler";
import { NextFunction, Request, Response } from "express";

export class CategoryController {
    static filterProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { name, minPrice, maxPrice, typeId } = req.query as {name?: string, minPrice?: number, maxPrice?: number, typeId?: string};
        const qb = AppDataSource.getRepository(Products).createQueryBuilder("product");

        console.log({name, minPrice, maxPrice, typeId});

        qb.leftJoinAndSelect("product.subCategories", "subCategory")
            .leftJoinAndSelect("subCategory.categories", "category")
            .leftJoinAndSelect("category.types", "type")
            .where("product.is_deleted = :is_deleted", {is_deleted: false})

        if(name){
            qb.andWhere("category.category_name LIKE :name OR subCategory.subcategory_name LIKE :name OR type.type_name LIKE :name OR product.product_name LIKE :name", { name: `%${name}%` });
        }
        if(minPrice){
            qb.andWhere("product.product_price >= :minPrice", {minPrice: Number(minPrice)})
        }
        if(maxPrice){
            qb.andWhere("product.product_price <= :maxPrice", {maxPrice: Number(maxPrice)})
        }
        if(typeId){
            qb.andWhere("type.type_id LIKE :typeId", {typeId: Number(typeId)})
        }

        const products = await qb.getMany();

        res.status(200).json(products);
    })

    static getAllCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const categoryRepo = AppDataSource.getRepository(Categories);
        const categories = await categoryRepo.find();
        res.status(200).json(categories);
    })

    static getAllSubCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const subCategoryRepo = AppDataSource.getRepository(SubCategories);
        const subCategories = await subCategoryRepo.find();
        res.status(200).json(subCategories);
    })

    static getAllTypes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const typeRepo = AppDataSource.getRepository(Types);
        const types = await typeRepo.find();
        res.status(200).json(types);
    })

    static getCategoryByProduct = asyncHandler(async (req: Request<{ product_id: string }>, res: Response, next: NextFunction) => {
        const { product_id } = req.params;
        const productRepo = AppDataSource.getRepository(Products);
        const product = await productRepo.findOne({
            where: { product_id: +product_id },
            relations: ["subCategories", "subCategories.categories", "subCategories.categories.types"]
        });
        res.status(200).json(product);
    })
}   