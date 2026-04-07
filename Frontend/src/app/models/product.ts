export interface Product {
    product_id: number;
    product_name: string;
    product_description: string;
    product_price: number;
    stock: number;
    manufacturing_date: string;
    expiry_date: string | null;
    is_deleted: boolean;
    createdAt: string; 
    updatedAt: string;
}

export interface CreateProduct{
    name:string,
    description:string,
    price: number,
    stock: number,
    subCategoryId: number,
    imageUrls: string[]
}

export interface CreateProductRes{
    message: string,
    product: Product,
}

export interface GetProducts{
    message: string,
    products: Product[],
}