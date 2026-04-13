"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const datasource_1 = __importDefault(require("../datasource"));
const Payments_1 = require("../entities/Payments");
const appError_1 = require("../errors/appError");
class PaymentService {
    static async getPaymentByOrder(orderId, userId) {
        const payment = await this.paymentRepo.findOne({
            where: { order: { order_id: orderId } },
            relations: ['order', 'order.user']
        });
        if (!payment)
            throw new appError_1.NotFound('Payment not found');
        if (payment.order.user.id !== userId) {
            throw new appError_1.UnauthorisedError('You are not authorized to access this payment');
        }
        return await datasource_1.default.getRepository(Payments_1.Payments).createQueryBuilder('payments')
            .leftJoinAndSelect('payments.order', 'order')
            .select([
            'payments.payment_id',
            'payments.amount_paid',
            'payments.payment_date',
            'payments.payment_method',
            'payments.payment_status',
            'payments.createdAt',
            'payments.updatedAt',
            'order.order_id',
            'order.totalAmount',
            'order.status'
        ])
            .where('payments.payment_id = :id', { id: payment.payment_id })
            .getOne();
    }
    static async getPaymentsByUser(userId, limit, skip) {
        return await this.paymentRepo.findAndCount({
            skip: skip,
            take: limit,
            where: { order: { user: { id: userId } } },
            relations: ['order']
        });
    }
    static async getAllPayments(limit, skip, status, method) {
        const qb = this.paymentRepo.createQueryBuilder('payment')
            .leftJoinAndSelect('payment.order', 'order');
        if (status)
            qb.andWhere('payment.payment_status = :status', { status });
        if (method)
            qb.andWhere('payment.payment_method = :method', { method });
        qb.orderBy('payment.createdAt', 'DESC').skip(skip).take(limit);
        return await qb.getManyAndCount();
    }
    static async getPaymentById(paymentId) {
        const payment = await this.paymentRepo.findOne({ where: { payment_id: paymentId } });
        if (!payment)
            throw new appError_1.NotFound("Payment not found");
        return payment;
    }
}
exports.PaymentService = PaymentService;
PaymentService.paymentRepo = datasource_1.default.getRepository(Payments_1.Payments);
