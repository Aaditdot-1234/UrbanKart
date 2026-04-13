"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const asyncHandler_1 = require("../errors/asyncHandler");
const productService_1 = require("../services/productService");
class ProductController {
}
exports.ProductController = ProductController;
_a = ProductController;
ProductController.createProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await productService_1.ProductService.createProduct(req.body);
    res.status(201).json({ message: "Product created successfully.", product });
});
ProductController.updateProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await productService_1.ProductService.updateProduct(+id, req.body);
    res.status(200).json({ message: "Product updated successfully.", updatedProduct });
});
ProductController.deleteProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await productService_1.ProductService.deleteProduct(+id);
    res.status(200).json({ message: "Product deleted successfully." });
});
ProductController.getAllProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const [products, total] = await productService_1.ProductService.getAllProducts(limit, skip);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({ message: 'Products Fetched sucessfully', products, meta: {
            totalItems: total,
            itemCount: products.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        } });
});
ProductController.getProductById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const product = await productService_1.ProductService.getProductById(+id);
    res.status(200).json(product);
});
