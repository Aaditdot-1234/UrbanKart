import { CreateOrder } from "../controllers/orderController";
import AppDataSource from "../datasource";
import { Address } from "../entities/Address";
import { OrderedProducts } from "../entities/OrderedProducts";
import { Orders, OrderStatus } from "../entities/Orders";
import { Payments, PaymentStatus } from "../entities/Payments";
import { Users } from "../entities/Users";
import { NotFound, ValidationError } from "../errors/appError";

export class OrderService {
    private static orderRepo = AppDataSource.getRepository(Orders);

    static async createOrder(userId: string, body: CreateOrder) {
        const { addressId, payment_method, payment_status } = body;
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(Users, {
                where: { id: userId },
                relations: ['carts', 'carts.cartItems', 'carts.cartItems.product']
            });

            if (!user) throw new NotFound("User not found");

            const activeCart = user.carts?.find(cart => cart.is_active);
            if (!activeCart || activeCart.cartItems.length === 0) throw new ValidationError("Your cart is empty.");

            const choosenAddress = await queryRunner.manager.findOne(Address, {
                where: {address_id: addressId, user: {id: userId}}
            })

            if(!choosenAddress) throw new NotFound("Address not found.")

            const order = queryRunner.manager.create(Orders, {
                user,
                totalAmount: 0,
                status: OrderStatus.Pending,
                orderProducts: [],
                address: choosenAddress,
            });

            for (const item of activeCart.cartItems) {
                const orderedProduct = queryRunner.manager.create(OrderedProducts, {
                    quantity: item.quantity,
                    product: item.product,
                    price: item.product.product_price
                });
                order.orderProducts.push(orderedProduct);
                order.totalAmount += Number(item.quantity) * Number(item.product.product_price);
            }

            const payment = queryRunner.manager.create(Payments, {
                order,
                amount_paid: order.totalAmount,
                payment_date: new Date(),
                payment_method,
                payment_status
            });

            await queryRunner.manager.save(order);
            await queryRunner.manager.save(payment);
            await queryRunner.commitTransaction();

            return order;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    static async getOrdersByUser(userId: string) {
        return await this.orderRepo.find({
            where: { user: { id: userId } },
            relations: ['orderProducts', 'orderProducts.product']
        });
    }

    static async getOrderById(orderId: number) {
        const order = await this.orderRepo.findOne({
            where: { order_id: orderId },
            relations: ['orderProducts', 'orderProducts.product']
        });
        if (!order) throw new NotFound("Order not found");
        return order;
    }

    static async filterByDate(startDate: Date, endDate: Date) {
        return await AppDataSource.createQueryBuilder()
            .select('orders')
            .from(Orders, 'orders')
            .where('orders.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getMany();
    }

    static async filterByStatus(status: OrderStatus) {
        return await AppDataSource.createQueryBuilder()
            .select('orders')
            .from(Orders, 'orders')
            .where('orders.status = :status', { status })
            .getMany();
    }

    static async filterByCategory(category: string) {
        return await AppDataSource.createQueryBuilder()
            .select('orders')
            .from(Orders, 'orders')
            .leftJoinAndSelect('orders.orderProducts', 'orderProducts')
            .leftJoinAndSelect('orderProducts.product', 'product')
            .where('product.category = :category', { category })
            .getMany();
    }

    static async updateStatus(orderId: number, status: OrderStatus) {
        if (!Object.values(OrderStatus).includes(status)) {
            throw new ValidationError(`Invalid status. Valid values: ${Object.values(OrderStatus).join(', ')}`);
        }

        const order = await this.orderRepo.findOne({
            where: { order_id: orderId },
            relations: ['payment']
        });

        if (!order) throw new NotFound("Order");
        if (order.status === OrderStatus.Delivered || order.status === OrderStatus.Cancelled) {
            throw new ValidationError(`Cannot update a ${order.status} order.`);
        }

        order.status = status;

        if (order.payment) {
            if (status === OrderStatus.Delivered) order.payment.payment_status = PaymentStatus.Completed;
            else if (status === OrderStatus.Cancelled) order.payment.payment_status = PaymentStatus.Refunded;
            await AppDataSource.getRepository(Payments).save(order.payment);
        }

        return await this.orderRepo.save(order);
    }
}