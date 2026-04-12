import { Meta } from "./auth";
import { Product } from "./product";

export interface Types {
    type_id: number;
    type_name: string,
    createdAt: string,
    updatedAt: string,
}

export interface GetTypes {
    message: string,
    types: Types[];
}

export interface Categories {
    category_id: number;
    category_name: string,
    category_description: string,
    createdAt: string,
    updatedAt: string,
}

export interface GetCategories {
    message: string,
    categories: Categories[];
    meta: Meta;
}

export interface SubCategories {
    subcategory_id: number;
    subcategory_name: string,
    subcategory_description: string,
    createdAt: string,
    updatedAt: string,
}

export interface GetSubCategories {
    message: string,
    subCategories: SubCategories[];
    meta: Meta
}

export interface ExtendedCategoriesWithTypes extends Categories {
    types: Types;
}

export interface ExtendedSubCategoriesWithCategories extends SubCategories {
    categories: ExtendedCategoriesWithTypes;
}

export interface ExtendedProductWithSubCategories extends Product {
    subCategories: ExtendedSubCategoriesWithCategories;
}

export interface CategoriesByProduct {
    message: string,
    product: ExtendedProductWithSubCategories[];
    meta: Meta,
}

export interface FilterProducts {
    message: string,
    products: ExtendedProductWithSubCategories[];
    meta: Meta,
}

export interface CategoryByProduct {
    message: string,
    product: ExtendedProductWithSubCategories;
}