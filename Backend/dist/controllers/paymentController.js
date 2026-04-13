"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const asyncHandler_1 = require("../errors/asyncHandler");
const paymentService_1 = require("../services/paymentService");
class PaymentController {
}
exports.PaymentController = PaymentController;
_a = PaymentController;
PaymentController.getAllPayments = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status, method } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const [payments, total] = await paymentService_1.PaymentService.getAllPayments(limit, skip, status, method);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        success: true, message: 'Loaded all payments successfully', payments, meta: {
            totalItems: total,
            itemCount: payments.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }
    });
});
PaymentController.getPaymentById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { paymentId } = req.params;
    const payment = await paymentService_1.PaymentService.getPaymentById(+paymentId);
    res.status(200).json({ success: true, message: 'Loaded payment successfully', payment });
});
PaymentController.getPaymentByOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { orderId } = req.params;
    const user = req.user;
    const payment = await paymentService_1.PaymentService.getPaymentByOrder(+orderId, user.id);
    res.status(200).json({ success: true, message: 'Loaded payment successfully', payment });
});
PaymentController.getMyPayments = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const [payments, total] = await paymentService_1.PaymentService.getPaymentsByUser(user.id, limit, skip);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        success: true, message: 'Loaded all payments successfully', payments, meta: {
            totalItems: total,
            itemCount: payments.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }
    });
});
