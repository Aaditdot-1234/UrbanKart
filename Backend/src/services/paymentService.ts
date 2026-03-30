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
        return payment;
    }

    static async getPaymentsByUser(userId: string) {
        return await this.paymentRepo.find({
            where: { order: { user: { id: userId } } },
            relations: ['order']
        });
    }

    static async getAllPayments(status?: PaymentStatus, method?: PaymentMethod): Promise<Payments[]> {
        const qb = this.paymentRepo.createQueryBuilder('payment')
            .leftJoinAndSelect('payment.order', 'order');

        if (status) qb.andWhere('payment.payment_status = :status', { status });
        if (method) qb.andWhere('payment.payment_method = :method', { method });

        return await qb.getMany();
    }

    static async updatePaymentStatus(paymentId: number, userId: string, newStatus: PaymentStatus) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const payment = await queryRunner.manager.findOne(Payments, {
                where: { payment_id: paymentId },
                relations: ['order', 'order.user']
            });

            if (!payment) throw new NotFound("Payment not found");
            if (payment.order.user.id !== userId) {
                throw new UnauthorisedError("Not authorized to update this payment");
            }
            if (!Object.values(PaymentStatus).includes(newStatus)) {
                throw new ValidationError("Invalid payment status");
            }
            if ([PaymentStatus.Completed, PaymentStatus.Refunded].includes(payment.payment_status)) {
                throw new ValidationError(`Cannot update a ${payment.payment_status} payment.`);
            }

            payment.payment_status = newStatus;

            if (payment.payment_method === PaymentMethod.Cash) {
                if (newStatus === PaymentStatus.Completed) payment.order.status = OrderStatus.Delivered;
                else if (newStatus === PaymentStatus.Refunded) payment.order.status = OrderStatus.Cancelled;
                else payment.order.status = OrderStatus.Pending;
            } 
            else {
                if (newStatus === PaymentStatus.Completed) payment.order.status = OrderStatus.Shipped;
                else if (newStatus === PaymentStatus.Refunded) payment.order.status = OrderStatus.Cancelled;
                else payment.order.status = OrderStatus.Pending;
            }

            await queryRunner.manager.save(payment.order);
            await queryRunner.manager.save(payment);
            await queryRunner.commitTransaction();
            return payment;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    static async getPaymentById(paymentId: number) {
        const payment = await this.paymentRepo.findOne({ where: { payment_id: paymentId } });
        if (!payment) throw new NotFound("Payment not found");
        return payment;
    }
}