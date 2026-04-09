import { Product } from "./product";

export interface Cart {
    cart_id: number;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    cartItems: CartItems[];
}

export interface CartItems {
    cart_item_id: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: Product;
}

export interface GetCart{
    message: string;
    activeCart: Cart;
}

export interface GetTotal{
    total: number;
}