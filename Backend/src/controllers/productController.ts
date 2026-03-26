import AppDataSource from "../datasource";
import { Products } from "../entities/Products";
import { NotFound } from "../errors/appError";
import { asyncHandler } from "../errors/asyncHandler";
import { NextFunction, Request, Response } from "express";

export class ProductController {
    static createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { name, description, price, stock, subCategory, productImage } = req.body;

        const productRepo = AppDataSource.getRepository(Products);

        const productInfo = productRepo.create({
            product_name: name,
            product_description: description,
            product_price: price,
            stock: stock,
            subCategories: subCategory,
            productImages: productImage,
        })

        await productRepo.save(productInfo);

        res.status(201).json({ message: "Product created successfully." });
    })

    static updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as { id: string };
        const { name, description, price, stock, subCategory, productImage } = req.body;

        const productRepo = AppDataSource.getRepository(Products);

        const product = await productRepo.findOne({
            where: { product_id: +id }
        });

        if (!product) {
            throw new NotFound("Product not found");
        }

        product.product_name = name;
        product.product_description = description;
        product.product_price = price;
        product.stock = stock;
        product.subCategories = subCategory;
        product.productImages = productImage;

        await productRepo.save(product);

        res.status(200).json({ message: "Product updated successfully." });
    })

    static deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as { id: string };
        const productRepo = AppDataSource.getRepository(Products);

        const product = await productRepo.findOne({
            where: { product_id: +id }
        });

        if (!product) {
            throw new NotFound("Product not found");
        }

        await productRepo.remove(product);

        res.status(200).json({ message: "Product deleted successfully." });
    })

    static getAllProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const productRepo = AppDataSource.getRepository(Products);

        const products = await productRepo.find();

        res.status(200).json(products);
    })

    static getProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as { id: string };
        const productRepo = AppDataSource.getRepository(Products);

        const product = await productRepo.findOne({
            where: { product_id: +id }
        });

        if (!product) {
            throw new NotFound("Product not found");
        }

        res.status(200).json(product);
    })
}