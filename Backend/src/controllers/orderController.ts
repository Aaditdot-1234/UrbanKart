import AppDataSource from "../datasource";
import { OrderedProducts } from "../entities/OrderedProducts";
import { Orders, OrderStatus } from "../entities/Orders";
import { Payments, PaymentStatus } from "../entities/Payments";
import { Users } from "../entities/Users";
import { NotFound, UnauthorisedError, ValidationError } from "../errors/appError";
import { asyncHandler } from "../errors/asyncHandler";
import { NextFunction, Request, Response } from "express";

export class OrderController {
    static createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { address, payment_method, payment_status } = req.body;
        const loggedInUserInfo = (req as any).user;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(Users, {
                where: { id: loggedInUserInfo.id },
                relations: ['cart', 'cart.cartItems', 'cart.cartItems.product', 'address']
            });

            if (!user) {
                throw new NotFound("User not found");
            }

            const order = queryRunner.manager.create(Orders, {
                user: user,
                totalAmount: 0,
                status: OrderStatus.Pending,
                orderProducts: [],
                address: address
            });

            let activeCart = user.carts.find(cart => cart.is_active);

            if (!activeCart) {
                throw new NotFound("Cart not found");
            }

            for (const item of activeCart.cartItems) {
                const orderedProduct = queryRunner.manager.create(OrderedProducts, {
                    quantity: item.quantity,
                    product: item.product,
                    price: item.product.product_price
                });

                order.orderProducts.push(orderedProduct);
                order.totalAmount += item.quantity * item.product.product_price;
            }

            const payment = queryRunner.manager.create(Payments, {
                order: order,
                amount_paid: order.totalAmount,
                payment_date: new Date(),
                payment_method: payment_method,
                payment_status: payment_status
            })

            await queryRunner.manager.save(order);
            await queryRunner.manager.save(payment);

            await queryRunner.commitTransaction();
            res.status(200).json({ message: "Order created successfully." });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    })

    static getAllOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const loggedInUserInfo = (req as any).user;

        const OrderRepo = AppDataSource.getRepository(Orders);
        const orders = await OrderRepo.find({
            where: { user: { id: loggedInUserInfo.id } },
            relations: ['orderProducts', 'orderProducts.product']
        });

        res.status(200).json({ message: "Orders fetched successfully.", orders });
    })

    static getOrderById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { orderId } = req.params;
        const orderRepo = AppDataSource.getRepository(Orders);

        const order = await orderRepo.findOne({
            where: { order_id: +orderId },
            relations: ['orderProducts', 'orderProducts.product']
        });

        if (!order) {
            throw new NotFound("Order not found");
        }

        res.status(200).json({ message: "Order fetched successfully.", order });
    })

    static filterorderbyDate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { startDate, endDate } = req.body;
        const qb = AppDataSource.createQueryBuilder();

        const orders = await qb.select('orders')
            .from(Orders, 'orders')
            .where('orders.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getMany();

        res.status(200).json({ message: "Orders fetched successfully.", orders });
    })

    static filterOrderByStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { status } = req.body;
        const qb = AppDataSource.createQueryBuilder();

        const orders = await qb.select('orders')
            .from(Orders, 'orders')
            .where('orders.status = :status', { status })
            .getMany();

        res.status(200).json({ message: "Orders fetched successfully.", orders });
    })

    static filterOrderByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { category } = req.body;
        const qb = AppDataSource.createQueryBuilder();

        const orders = await qb.select('orders')
            .from(Orders, 'orders')
            .leftJoinAndSelect('orders.orderProducts', 'orderProducts')
            .leftJoinAndSelect('orderProducts.product', 'product')
            .where('product.category = :category', { category })
            .getMany();

        res.status(200).json({ message: "Orders fetched successfully.", orders });
    })

    static updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!Object.values(OrderStatus).includes(status)) {
            throw new ValidationError(`Invalid status. Valid values: ${Object.values(OrderStatus).join(', ')}`);
        }

        const orderRepo = AppDataSource.getRepository(Orders);

        const order = await orderRepo.findOne({
            where: { order_id: +orderId },
            relations: ['payment']
        });

        if (!order) {
            throw new NotFound("Order");
        }

        if (order.status === OrderStatus.Delivered || order.status === OrderStatus.Cancelled) {
            throw new ValidationError(`Cannot update a ${order.status} order.`);
        }

        order.status = status;

        if (order.payment) {
            if (status === OrderStatus.Delivered) {
                order.payment.payment_status = PaymentStatus.Completed;
            } else if (status === OrderStatus.Cancelled) {
                order.payment.payment_status = PaymentStatus.Refunded;
            }
            await orderRepo.manager.save(Payments, order.payment);
        }

        await orderRepo.save(order);

        res.status(200).json({ message: `Order status updated to '${status}'.` });
    })
}