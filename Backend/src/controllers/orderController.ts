import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { OrderService } from "../services/orderService";
import { OrderStatus } from "../entities/Orders";
import { PaymentMethod, PaymentStatus } from "../entities/Payments";
import { Users } from "../entities/Users";

export class OrderController {
    static creationOfOrder = asyncHandler(async (req: Request, res: Response) => {
        const { addressId } = req.body as { addressId: number }
        const loggedInUserInfo = req.user as Users;
        const order = await OrderService.createOrder(loggedInUserInfo.id, addressId);
        res.status(200).json({ message: "Order created successfully.", order });
    });

    static getAllOrders = asyncHandler(async (req: Request, res: Response) => {
        const loggedInUserInfo = req.user as Users;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [orders, total] = await OrderService.getOrdersByUser(loggedInUserInfo.id, skip, limit);
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({
            message: "Orders fetched successfully.", orders, meta: {
                totalItems: total,
                itemCount: orders.length,
                itemsPerPage: limit,
                totalPages: totalPages,
                currentPage: page,
            }
        });
    });

    static getOrderById = asyncHandler(async (req: Request<{ orderId: number }>, res: Response) => {
        const { orderId } = req.params;

        const order = await OrderService.getOrderById(+orderId);
        res.status(200).json({ message: "Order fetched successfully.", order });
    });

    static filterorderbyDate = asyncHandler(async (req: Request, res: Response) => {
        const loggedInUser = req.user as Users;
        const { startDate, endDate } = req.query as { startDate: string, endDate: string };
        const start = new Date(startDate);
        const end = new Date(endDate);

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [orders, total] = await OrderService.filterByDate(loggedInUser.id, start, end, skip, limit);
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({
            message: "Orders fetched successfully.", orders, meta: {
                totalItems: total,
                itemCount: orders.length,
                itemsPerPage: limit,
                totalPages: totalPages,
                currentPage: page,
            }
        });
    });

    static filterOrderByStatus = asyncHandler(async (req: Request, res: Response) => {
        const loggedInUser = req.user as Users;
        const { status } = req.query;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [orders, total] = await OrderService.filterByStatus(loggedInUser.id, status as OrderStatus, limit, skip);
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({
            message: "Orders fetched successfully.", orders, meta: {
                totalItems: total,
                itemCount: orders.length,
                itemsPerPage: limit,
                totalPages: totalPages,
                currentPage: page,
            }
        });
    });

    static updateOrderStatus = asyncHandler(async (req: Request<{}, any, { orderId: number, payment_method: string }>, res: Response) => {
        const { orderId, payment_method } = req.body;
        await OrderService.updateStatus(+orderId, payment_method);
        res.status(200).json({ message: `Order status updated to '${OrderStatus.Completed} and payment status is updated to ${PaymentStatus.Completed}'.` });
    });
}