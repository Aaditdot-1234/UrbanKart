import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { PaymentService } from "../services/paymentService";
import { PaymentMethod, PaymentStatus } from "../entities/Payments";
import { Users } from "../entities/Users";

export class PaymentController {
    static getAllPayments = asyncHandler(async (req: Request, res: Response) => {
        const { status, method } = req.query as Partial<{status: PaymentStatus, method: PaymentMethod}>;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const skip = (page - 1) * limit;

        const [payments, total] = await PaymentService.getAllPayments( limit, skip, status, method);
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({ success:true, message: 'Loaded all payments successfully', payments, meta: {
            totalItems: total,
            itemCount: payments.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        } });
    });

    static getPaymentById = asyncHandler(async (req: Request<{paymentId: number}>, res: Response) => {
        const {paymentId} = req.params;
        const payment = await PaymentService.getPaymentById(+paymentId);
        res.status(200).json({ success: true, message: 'Loaded payment successfully', payment });
    });
    
    static getPaymentByOrder = asyncHandler(async (req: Request<{orderId: number}>, res: Response) => {
        const {orderId} = req.params;
        const user = req.user as Users;
        const payment = await PaymentService.getPaymentByOrder(+orderId, user.id);
        res.status(200).json({ success: true, message: 'Loaded payment successfully', payment });
    });
    
    static getMyPayments = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as Users;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const skip = (page - 1) * limit;


        const [payments, total] = await PaymentService.getPaymentsByUser(user.id, limit, skip);
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({ success: true, message: 'Loaded all payments successfully', payments });
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