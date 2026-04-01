import AppDataSource from "../datasource";
import { Products } from "../entities/Products";
import { NotFound } from "../errors/appError";
import { SubCategories } from "../entities/SubCategories";
import { ProductImages } from "../entities/ProductImages";

export interface ProductRequest {
    product_name: string;
    product_description: string;
    product_price: number;
    stock: number;
    subCategoryId: number;
    imageUrls: ProductImages[];
}

export class ProductService {
    private static productRepo = AppDataSource.getRepository(Products);

    static async createProduct(data: ProductRequest) {
        const {
            product_name,
            product_description,
            product_price,
            stock,
            subCategoryId,
            imageUrls
        } = data;
        console.log(data);

        const subCategory = await AppDataSource
            .getRepository(SubCategories)
            .findOneBy({ subcategory_id: Number(subCategoryId) });

        if (!subCategory) throw new Error("Subcategory not found");

        console.log(subCategory);

        const product = this.productRepo.create({
            product_name,
            product_description,
            product_price,
            stock,
            subCategories: subCategory,
            productImages: imageUrls
        });

        return await this.productRepo.save(product);
    }

    static async updateProduct(id: number, data: Partial<Products>) {
        const product = await this.productRepo.findOne({
            where: { product_id: id }
        });

        if (!product) throw new NotFound("Product not found");

        product.product_name = data.product_name ?? product.product_name;
        product.product_description = data.product_description ?? product.product_description;
        product.product_price = data.product_price ?? product.product_price;
        product.stock = data.stock ?? product.stock;
        product.subCategories = data.subCategories ?? product.subCategories;
        product.productImages = data.productImages ?? product.productImages;

        return await this.productRepo.save(product);
    }

    static async deleteProduct(id: number) {
        const product = await this.productRepo.findOne({
            where: { product_id: id }
        });

        if (!product) throw new NotFound("Product not found");
        product.is_deleted = true

        return await this.productRepo.save(product);
    }

    static async getAllProducts() {
        return await this.productRepo.find({
            where: {is_deleted: false}
        });
    }

    static async getProductById(id: number) {
        const product = await this.productRepo.findOne({
            where: { product_id: id }
        });

        if (!product) throw new NotFound("Product not found");
        return product;
    }
}