import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { ProductService, ProductRequest } from "../services/productService";
import { Products } from "../entities/Products";

export class ProductController {
    static createProduct = asyncHandler(async (req: Request<{}, any, ProductRequest>, res: Response) => {
        await ProductService.createProduct(req.body);
        res.status(201).json({ message: "Product created successfully." });
    });

    static updateProduct = asyncHandler(async (req: Request<{ id: string }, any, Partial<Products>>, res: Response) => {
        const { id } = req.params;
        await ProductService.updateProduct(+id, req.body);
        res.status(200).json({ message: "Product updated successfully." });
    });

    static deleteProduct = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        await ProductService.deleteProduct(+id);
        res.status(200).json({ message: "Product deleted successfully." });
    });

    static getAllProducts = asyncHandler(async (req: Request, res: Response) => {
        const products = await ProductService.getAllProducts();
        res.status(200).json(products);
    });

    static getProductById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        const product = await ProductService.getProductById(+id);
        res.status(200).json(product);
    });
}