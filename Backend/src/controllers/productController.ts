import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { ProductService, ProductRequest, ProductUpdateRequest } from "../services/productService";

export class ProductController {
    static createProduct = asyncHandler(async (req: Request<{}, any, ProductRequest>, res: Response) => {
        const product = await ProductService.createProduct(req.body);
        res.status(201).json({ message: "Product created successfully.", product });
    });

    static updateProduct = asyncHandler(async (req: Request<{ id: string }, any, ProductUpdateRequest>, res: Response) => {
        const { id } = req.params;
        const updatedProduct = await ProductService.updateProduct(+id, req.body);
        res.status(200).json({ message: "Product updated successfully.", updatedProduct });
    });

    static deleteProduct = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        await ProductService.deleteProduct(+id);
        res.status(200).json({ message: "Product deleted successfully."});
    });

    static getAllProducts = asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt( req.query.limit as string) || 9;
        const skip = (page - 1) * limit;

        const [products, total] = await ProductService.getAllProducts( limit, skip );
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({message:'Products Fetched sucessfully', products, meta: {
            totalItems: total,
            itemCount: products.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }});
    });

    static getProductById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        const product = await ProductService.getProductById(+id);
        res.status(200).json(product);
    });
}