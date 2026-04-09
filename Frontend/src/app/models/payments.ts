import { Order } from "./order";

export interface Payments {
    payment_id: number;
    amount_paid: number;
    payment_date: string;
    payment_method: string;
    payment_status: string;
    createdAt: string;
    updatedAt: string;
    order: Pick<Order, 'order_id' | 'totalAmount' | 'status'> |  Order;
} 

export interface GetPayments{
    success: boolean; 
    message: string;
    payments: Payments[];
}

export interface GetByOrder{
    success: boolean;
    message: string;
    payments: Payments | Omit<Payments, 'order'>;
}