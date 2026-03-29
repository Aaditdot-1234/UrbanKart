import AppDataSource from "../datasource";
import { OrderStatus } from "../entities/Orders";
import { PaymentMethod, Payments, PaymentStatus } from "../entities/Payments";
import { NotFound, UnauthorisedError, ValidationError } from "../errors/appError";
import { asyncHandler } from "../errors/asyncHandler";
import { NextFunction, Request, Response } from "express";

export class PaymentController {
    static getPaymentByOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const orderId = req.params.orderId;
        const loggedInUserInfo = (req as any).user;

        const paymentRepo = AppDataSource.getRepository(Payments);

        const payment = await paymentRepo.findOne({
            where: {
                order: { order_id: +orderId }
            },
            relations: ['order', 'order.user']
        })

        if (!payment) {
            throw new NotFound('Payment not found');
        }

        if (payment.order.user.id !== loggedInUserInfo.id) {
            throw new UnauthorisedError('You are not authorized to access this payment');
        }

        res.status(200).json({
            success: true,
            payment
        })
    })

    static getMyPayments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const loggedInUserInfo = (req as any).user;
        const paymentRepo = AppDataSource.getRepository(Payments);

        const payments = await paymentRepo.find({
            where: {
                order: {
                    user: { id: loggedInUserInfo.id }
                }
            },
            relations: ['order']
        })

        res.status(200).json({
            success: true,
            payments
        })
    })

    // Admin only
    static getAllPayments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { status, method } = req.query;
        const paymentRepo = AppDataSource.getRepository(Payments);

        const qb = paymentRepo.createQueryBuilder('payment')
            .leftJoinAndSelect('payment.order', 'order');

        if (status) {
            qb.andWhere('payment.payment_status = :status', { status });
        }

        if (method) {
            qb.andWhere('payment.payment_method = :method', { method });
        }

        const payments = await qb.getMany();

        res.status(200).json({
            success: true,
            payments
        })
    })

    static updatePayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { paymentId } = req.params;
        const loggedInUserInfo = (req as any).user;
        const { payment_status } = req.body;
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const payment = await queryRunner.manager.findOne(Payments, {
                where: {
                    payment_id: +paymentId,
                },
                relations: ['order', 'order.user']
            })

            if (!payment) {
                throw new NotFound("Payment not found");
            }

            if (payment.order.user.id !== loggedInUserInfo.id) {
                throw new UnauthorisedError("You are not authorized to update this payment");
            }

            if (!Object.values(PaymentStatus).includes(payment_status)) {
                throw new ValidationError(`Invalid payment status. Valid values: ${Object.values(PaymentStatus).join(', ')}`);
            }

            if (payment.payment_status === PaymentStatus.Completed || payment.payment_status === PaymentStatus.Refunded) {
                throw new ValidationError(`Cannot update a ${payment.payment_status} payment.`);
            }

            payment.payment_status = payment_status;

            if (payment.payment_method === PaymentMethod.Cash) {
                if (payment_status === PaymentStatus.Completed) {
                    payment.order.status = OrderStatus.Delivered;
                }
                else if (payment_status === PaymentStatus.Refunded) {
                    payment.order.status = OrderStatus.Cancelled;
                }
                else {
                    payment.order.status = OrderStatus.Pending;
                }
            }

            if (payment.payment_method === PaymentMethod.Bank || payment.payment_method === PaymentMethod.Credit || payment.payment_method === PaymentMethod.Debit) {
                if (payment_status === PaymentStatus.Completed) {
                    payment.order.status = OrderStatus.Shipped;
                }
                else if (payment_status === PaymentStatus.Refunded) {
                    payment.order.status = OrderStatus.Cancelled;
                }
                else {
                    payment.order.status = OrderStatus.Pending;
                }
            }

            await queryRunner.manager.save(payment);
            await queryRunner.commitTransaction();

            res.status(200).json({
                success: true,
                message: "Payment updated successfully",
                payment
            })

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    })

    static getPaymentById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { paymentId } = req.params;
        const paymentRepo = AppDataSource.getRepository(Payments);

        const payment = await paymentRepo.findOne({
            where: { payment_id: +paymentId }
        })

        if (!payment) {
            throw new NotFound("Payment not found");
        }

        res.status(200).json({
            success: true,
            payment
        })
    })
}