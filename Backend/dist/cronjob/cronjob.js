"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const datasource_1 = __importDefault(require("../datasource"));
const Orders_1 = require("../entities/Orders");
const typeorm_1 = require("typeorm");
const Payments_1 = require("../entities/Payments");
node_cron_1.default.schedule('*/5 * * * *', async () => {
    console.log("Cron job started.");
    const timeDiff = new Date(Date.now() - 30 * 60 * 1000);
    const orders = await datasource_1.default.getRepository(Orders_1.Orders).find({
        where: { status: Orders_1.OrderStatus.Pending, createdAt: (0, typeorm_1.LessThan)(timeDiff) },
        relations: ['payment', 'orderProducts', 'orderProducts.product']
    });
    if (orders.length === 0) {
        console.log("No pending orders found.");
        return;
    }
    for (const order of orders) {
        const queryRunner = datasource_1.default.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const item of order.orderProducts) {
                const product = item.product;
                if (product) {
                    product.stock += item.quantity;
                    await queryRunner.manager.save(product);
                }
            }
            order.status = Orders_1.OrderStatus.Cancelled;
            order.payment.payment_status = Payments_1.PaymentStatus.Cancelled;
            await queryRunner.manager.save(order.payment);
            await queryRunner.manager.save(order);
            await queryRunner.commitTransaction();
            console.log(`Cancelled ${orders.length} pending orders.`);
        }
        catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            console.error("Error in cron job:", error);
        }
        finally {
            await queryRunner.release();
        }
    }
});
