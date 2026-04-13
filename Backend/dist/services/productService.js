"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const datasource_1 = __importDefault(require("../datasource"));
const Products_1 = require("../entities/Products");
const appError_1 = require("../errors/appError");
const SubCategories_1 = require("../entities/SubCategories");
const ProductImages_1 = require("../entities/ProductImages");
class ProductService {
    static async createProduct(data) {
        const { product_name, product_description, product_price, stock, subCategoryId, imageUrls } = data;
        const subCategory = await datasource_1.default
            .getRepository(SubCategories_1.SubCategories)
            .findOneBy({ subcategory_id: Number(subCategoryId) });
        if (!subCategory)
            throw new Error("Subcategory not found");
        const productImages = imageUrls.map((path, index) => this.imageRepo.create({ image_path: path, is_primary: index === 0 }));
        const product = this.productRepo.create({
            product_name,
            product_description,
            product_price,
            stock,
            subCategories: subCategory,
            productImages
        });
        const savedProduct = await this.productRepo.save(product);
        return savedProduct;
    }
    static async updateProduct(id, data) {
        const product = await this.productRepo.findOne({
            where: { product_id: id },
            relations: ['productImages']
        });
        if (!product)
            throw new appError_1.NotFound("Product not found");
        if (data.product_name !== undefined)
            product.product_name = data.product_name;
        if (data.product_description !== undefined)
            product.product_description = data.product_description;
        if (data.product_price !== undefined)
            product.product_price = data.product_price;
        if (data.stock !== undefined)
            product.stock = data.stock;
        if (data.subCategoryId !== undefined) {
            const subCategory = await datasource_1.default
                .getRepository(SubCategories_1.SubCategories)
                .findOneBy({ subcategory_id: Number(data.subCategoryId) });
            if (!subCategory)
                throw new Error("Subcategory not found");
            product.subCategories = subCategory;
        }
        if (data.imageUrls !== undefined) {
            // Delete old images and replace with new ones
            await this.imageRepo.delete({ product: { product_id: id } });
            product.productImages = data.imageUrls.map((path, index) => this.imageRepo.create({ image_path: path, is_primary: index === 0 }));
        }
        const savedProduct = await this.productRepo.save(product);
        return savedProduct;
    }
    static async deleteProduct(id) {
        const product = await this.productRepo.findOne({
            where: { product_id: id }
        });
        if (!product)
            throw new appError_1.NotFound("Product not found");
        product.is_deleted = true;
        return await this.productRepo.save(product);
    }
    static async getAllProducts(limit, skip) {
        return await this.productRepo.findAndCount({
            skip: skip,
            take: limit,
            where: { is_deleted: false }
        });
    }
    static async getProductById(id) {
        const product = await this.productRepo.findOne({
            where: { product_id: id }
        });
        if (!product)
            throw new appError_1.NotFound("Product not found");
        return product;
    }
}
exports.ProductService = ProductService;
ProductService.productRepo = datasource_1.default.getRepository(Products_1.Products);
ProductService.imageRepo = datasource_1.default.getRepository(ProductImages_1.ProductImages);
