import cron from 'node-cron';
import AppDataSource from '../datasource';
import { Orders, OrderStatus } from '../entities/Orders';
import { LessThan } from 'typeorm';
import { NotFound } from '../errors/appError';
import { OrderedProducts } from '../entities/OrderedProducts';
import { Products } from '../entities/Products';
import { PaymentStatus } from '../entities/Payments';

cron.schedule('*/5 * * * *', async () => {
    console.log("Cron job started.");

    const timeDiff = new Date(Date.now() - 30 * 60 * 1000)

    const orders = await AppDataSource.getRepository(Orders).find({
        where: { status: OrderStatus.Pending, createdAt: LessThan(timeDiff) },
        relations: ['payment', 'orderProducts', 'orderProducts.product']
    })

    if (orders.length === 0) {
        console.log("No pending orders found.");
        return;
    }

    for (const order of orders) {

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            for (const item of order.orderProducts) {
                const product = item.product
                if (product) {
                    product.stock += item.quantity;
                    await queryRunner.manager.save(product);
                }
            }

            order.status = OrderStatus.Cancelled;
            order.payment.payment_status = PaymentStatus.Cancelled;

            await queryRunner.manager.save(order.payment);
            await queryRunner.manager.save(order);

            await queryRunner.commitTransaction();
            console.log(`Cancelled ${orders.length} pending orders.`);

        } catch (error) {

            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            console.error("Error in cron job:", error);

        } finally {
            await queryRunner.release();
        }
    }
});