import AppDataSource from "../datasource";
import { OrderStatus } from "../entities/Orders";
import { PaymentMethod, Payments, PaymentStatus } from "../entities/Payments";
import { NotFound, UnauthorisedError, ValidationError } from "../errors/appError";

export class PaymentService {
    private static paymentRepo = AppDataSource.getRepository(Payments);

    static async getPaymentByOrder(orderId: number, userId: string) {
        const payment = await this.paymentRepo.findOne({
            where: { order: { order_id: orderId } },
            relations: ['order', 'order.user']
        });

        if (!payment) throw new NotFound('Payment not found');
        if (payment.order.user.id !== userId) {
            throw new UnauthorisedError('You are not authorized to access this payment');
        }
        return await AppDataSource.getRepository(Payments).createQueryBuilder('payments')
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

    static async getPaymentsByUser(userId: string, limit: number, skip: number) {
        return await this.paymentRepo.findAndCount({
            skip: skip,
            take: limit,
            where: { order: { user: { id: userId } } },
            relations: ['order']
        });
    }

    static async getAllPayments(limit: number, skip: number, status?: PaymentStatus, method?: PaymentMethod): Promise<[Payments[], number]> {
        const qb = this.paymentRepo.createQueryBuilder('payment')
            .leftJoinAndSelect('payment.order', 'order');

        if (status) qb.andWhere('payment.payment_status = :status', { status });
        if (method) qb.andWhere('payment.payment_method = :method', { method });

        qb.orderBy('payment.createdAt', 'DESC').skip(skip).take(limit);
        return await qb.getManyAndCount();
    }


    static async getPaymentById(paymentId: number) {
        const payment = await this.paymentRepo.findOne({ where: { payment_id: paymentId } });
        if (!payment) throw new NotFound("Payment not found");
        return payment;
    }
}