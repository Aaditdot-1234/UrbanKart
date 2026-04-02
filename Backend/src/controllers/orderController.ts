import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { OrderService } from "../services/orderService";
import { OrderStatus } from "../entities/Orders";
import { PaymentMethod, PaymentStatus } from "../entities/Payments";
import { Users } from "../entities/Users";

export interface CreateOrder{
    addressId: number, 
    payment_status: PaymentStatus, 
    payment_method: PaymentMethod
}

export class OrderController {
    static createOrder = asyncHandler(async (req: Request<{}, any, CreateOrder>, res: Response) => {
        const loggedInUserInfo = req.user as Users;
        await OrderService.createOrder(loggedInUserInfo.id, req.body);
        res.status(200).json({ message: "Order created successfully." });
    });

    static getAllOrders = asyncHandler(async (req: Request, res: Response) => {
        const loggedInUserInfo = req.user as Users;
        const orders = await OrderService.getOrdersByUser(loggedInUserInfo.id);
        res.status(200).json({ message: "Orders fetched successfully.", orders });
    });

    static getOrderById = asyncHandler(async (req: Request<{orderId: number}>, res: Response) => { 
        const {orderId} = req.params;

        const order = await OrderService.getOrderById(+orderId);
        res.status(200).json({ message: "Order fetched successfully.", order });
    });

    static filterorderbyDate = asyncHandler(async (req: Request, res: Response) => {
        const loggedInUser = req.user as Users;
        const { startDate, endDate } = req.query as {startDate: string, endDate:string};
        const start = new Date(startDate);
        const end = new Date(endDate);
        const orders = await OrderService.filterByDate(loggedInUser.id, start, end);
        res.status(200).json({ message: "Orders fetched successfully.", orders });
    });
    
    static filterOrderByStatus = asyncHandler(async (req: Request, res: Response) => {
        const loggedInUser = req.user as Users;
        const {status} = req.query;
        
        const orders = await OrderService.filterByStatus(loggedInUser.id, status as OrderStatus);
        res.status(200).json({ message: "Orders fetched successfully.", orders });
    });
    
    static filterOrderByCategory = asyncHandler(async (req: Request, res: Response) => {
        const loggedInUser = req.user as Users;
        const {category} = req.query as {category: string};

        const orders = await OrderService.filterByCategory(loggedInUser.id, category);
        res.status(200).json({ message: "Orders fetched successfully.", orders });
    });

    static updateOrderStatus = asyncHandler(async (req: Request<{orderId: number}>, res: Response) => {
        const { orderId } = req.params;
        const { status } = req.body;
        await OrderService.updateStatus(+orderId, status as OrderStatus);
        res.status(200).json({ message: `Order status updated to '${status}'.` });
    });
}