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
    imageUrls: string[];
}

export interface ProductUpdateRequest {
    product_name?: string;
    product_description?: string;
    product_price?: number;
    stock?: number;
    subCategoryId?: number;
    imageUrls?: string[];
}

export class ProductService {
    private static productRepo = AppDataSource.getRepository(Products);
    private static imageRepo = AppDataSource.getRepository(ProductImages);

    static async createProduct(data: ProductRequest) {
        const {
            product_name,
            product_description,
            product_price,
            stock,
            subCategoryId,
            imageUrls
        } = data;

        const subCategory = await AppDataSource
            .getRepository(SubCategories)
            .findOneBy({ subcategory_id: Number(subCategoryId) });

        if (!subCategory) throw new Error("Subcategory not found");

        const productImages = imageUrls.map((url, index) =>
            this.imageRepo.create({ image_path: url, is_primary: index === 0 })
        );

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

    static async updateProduct(id: number, data: ProductUpdateRequest) {
        const product = await this.productRepo.findOne({
            where: { product_id: id },
            relations: ['productImages']
        });

        if (!product) throw new NotFound("Product not found");
        

        if(data.product_name !== undefined && data.product_name !== ''){
            product.product_name = data.product_name;
        }
        if(data.product_description !== undefined && data.product_description !== ''){
            product.product_description = data.product_description;
        }
        if(data.product_price !== undefined && data.product_price > 0){
            product.product_price = data.product_price;
        }
        if(data.stock !== undefined && data.stock >= 0 && data.stock !== null){
            product.stock = data.stock;
        }

        if (data.subCategoryId !== undefined) {
            const subCategory = await AppDataSource
                .getRepository(SubCategories)
                .findOneBy({ subcategory_id: Number(data.subCategoryId) });
            if (!subCategory) throw new Error("Subcategory not found");
            product.subCategories = subCategory;
        }

        if (data.imageUrls !== undefined) {
            await this.imageRepo.delete({ product: { product_id: id } });
            product.productImages = data.imageUrls.map((path, index) =>
                this.imageRepo.create({ image_path: path, is_primary: index === 0 })
            );
        }

        const savedProduct = await this.productRepo.save(product);
        return savedProduct;
    }

    static async deleteProduct(id: number) {
        const product = await this.productRepo.findOne({
            where: { product_id: id }
        });

        if (!product) throw new NotFound("Product not found");
        product.is_deleted = true

        return await this.productRepo.save(product);
    }

    static async getAllProducts(limit: number, skip: number) {
        return await this.productRepo.findAndCount({
            skip: skip,
            take: limit,
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