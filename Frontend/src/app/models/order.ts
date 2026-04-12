import { Address } from "./address";
import { Meta } from "./auth";
import { Product } from "./product";

export interface Order {
    order_id: number;
    totalAmount: number;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    orderProducts: Pick<OrderProducts, 'quantity' | 'price'>[] | OrderProducts[];
    address?: Pick<Address, 'address'>;
}

export interface OrderProducts {
    order_product_id: number;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
    product: Product | Pick<Product, 'product_name'>;
}

export interface GetOrder {
    message: string;
    order: Order;
}

export interface GetAllOrders {
    message: string;
    orders: Order[];
    meta: Meta;
}

export interface FilterOrders {
    message: string;
    orders: Omit<Order, 'orderProducts'>[];
    meta: Meta;
}