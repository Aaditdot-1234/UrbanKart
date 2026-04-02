import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { PaymentService } from "../services/paymentService";
import { PaymentMethod, PaymentStatus } from "../entities/Payments";
import { Users } from "../entities/Users";

export class PaymentController {
    static getAllPayments = asyncHandler(async (req: Request, res: Response) => {
        const { status, method } = req.query as Partial<{status: PaymentStatus, method: PaymentMethod}>;
        const payments = await PaymentService.getAllPayments(status, method);
        res.status(200).json({ success: true, payments });
    });

    static getPaymentById = asyncHandler(async (req: Request<{paymentId: number}>, res: Response) => {
        const {paymentId} = req.params;
        const payment = await PaymentService.getPaymentById(+paymentId);
        res.status(200).json({ success: true, payment });
    });
    
    static getPaymentByOrder = asyncHandler(async (req: Request<{orderId: number}>, res: Response) => {
        const {orderId} = req.params;
        const user = req.user as Users;
        const payment = await PaymentService.getPaymentByOrder(+orderId, user.id);
        res.status(200).json({ success: true, payment });
    });
    
    static getMyPayments = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as Users;
        const payments = await PaymentService.getPaymentsByUser(user.id);
        res.status(200).json({ success: true, payments });
    });
    
    static updatePayment = asyncHandler(async (req: Request<{paymentId: number}>, res: Response) => {
        const {paymentId} = req.params;
        const user = req.user as Users;
        const { payment_status } = req.body;
        const payment = await PaymentService.updatePaymentStatus(+paymentId, user.id, payment_status as PaymentStatus);
        
        res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            payment
        });
    });

}