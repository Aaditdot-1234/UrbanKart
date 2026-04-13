"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const datasource_1 = __importDefault(require("../datasource"));
const Categories_1 = require("../entities/Categories");
const Products_1 = require("../entities/Products");
const SubCategories_1 = require("../entities/SubCategories");
const Types_1 = require("../entities/Types");
const asyncHandler_1 = require("../errors/asyncHandler");
class CategoryController {
}
exports.CategoryController = CategoryController;
_a = CategoryController;
CategoryController.filterProducts = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const { name, minPrice, maxPrice, typeId, categoryId, subCategoryId } = req.query;
    // Parse comma-separated ID lists for multi-checkbox support
    const typeIds = typeId ? typeId.split(',').map(Number).filter(n => !isNaN(n) && n > 0) : [];
    const categoryIds = categoryId ? categoryId.split(',').map(Number).filter(n => !isNaN(n) && n > 0) : [];
    const subCategoryIds = subCategoryId ? subCategoryId.split(',').map(Number).filter(n => !isNaN(n) && n > 0) : [];
    const qb = datasource_1.default.getRepository(Products_1.Products).createQueryBuilder("product");
    qb.leftJoinAndSelect("product.subCategories", "subCategory")
        .leftJoinAndSelect("subCategory.categories", "category")
        .leftJoinAndSelect("category.types", "type")
        .select([
        'product.product_id',
        'product.product_name',
        'product.product_description',
        'product.product_price',
        'product.manufacturing_date',
        'product.expiry_date',
        'product.stock',
        'subCategory.subcategory_id',
        'subCategory.subcategory_name',
        'subCategory.subcategory_description',
        'category.category_id',
        'category.category_name',
        'category.category_description',
        'type.type_id',
        'type.type_name',
    ])
        .where("product.is_deleted = :is_deleted", { is_deleted: false });
    if (name) {
        qb.andWhere("category.category_name LIKE :name OR subCategory.subcategory_name LIKE :name OR type.type_name LIKE :name OR product.product_name LIKE :name", { name: `%${name}%` });
    }
    if (minPrice) {
        qb.andWhere("product.product_price >= :minPrice", { minPrice: Number(minPrice) });
    }
    if (maxPrice) {
        qb.andWhere("product.product_price <= :maxPrice", { maxPrice: Number(maxPrice) });
    }
    if (typeIds.length > 0) {
        qb.andWhere("type.type_id IN (:...typeIds)", { typeIds });
    }
    if (categoryIds.length > 0) {
        qb.andWhere("category.category_id IN (:...categoryIds)", { categoryIds });
    }
    if (subCategoryIds.length > 0) {
        qb.andWhere("subCategory.subcategory_id IN (:...subCategoryIds)", { subCategoryIds });
    }
    qb.skip(skip).take(limit);
    const [products, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        message: 'Products filtered successfully.', products, meta: {
            totalItems: total,
            itemCount: products.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }
    });
});
CategoryController.getAllCategories = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const categoryRepo = datasource_1.default.getRepository(Categories_1.Categories);
    const [categories, total] = await categoryRepo.findAndCount({
        skip: skip,
        take: limit,
    });
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        message: 'Categories fetched successfully', categories, meta: {
            totalItems: total,
            itemCount: categories.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }
    });
});
CategoryController.getAllSubCategories = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const subCategoryRepo = datasource_1.default.getRepository(SubCategories_1.SubCategories);
    const [subCategories, total] = await subCategoryRepo.findAndCount({
        skip: skip,
        take: limit
    });
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        message: 'Subcategories fetched successfully', subCategories, meta: {
            totalItems: total,
            itemCount: subCategories.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }
    });
});
CategoryController.getAllTypes = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const typeRepo = datasource_1.default.getRepository(Types_1.Types);
    const types = await typeRepo.find();
    res.status(200).json({ message: 'Types fetched successfully', types });
});
CategoryController.getCategoryByProduct = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { product_id } = req.params;
    const productRepo = datasource_1.default.getRepository(Products_1.Products);
    const product = await datasource_1.default.getRepository(Products_1.Products).createQueryBuilder('products')
        .leftJoinAndSelect('products.subCategories', 'sub')
        .leftJoinAndSelect('sub.categories', 'cat')
        .leftJoinAndSelect('cat.types', 'types')
        .select([
        'products.product_id',
        'products.product_name',
        'sub.subcategory_id',
        'sub.subcategory_name',
        'sub.subcategory_description',
        'cat.category_id',
        'cat.category_name',
        'cat.category_description',
        'types.type_id',
        'types.type_name',
    ])
        .where('products.product_id = :id', { id: product_id })
        .getOne();
    res.status(200).json({ message: 'Category fetched successfully by product', product });
});
