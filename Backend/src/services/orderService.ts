import { skip } from "node:test";
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
        await queryRunner.startTransaction()

        try {
            const user = await queryRunner.manager.findOne(Users, {
                where: { id: userId },
                relations: ['carts', 'carts.cartItems', 'carts.cartItems.product']
            });

            if (!user) throw new NotFound("User not found");

            const activeCart = user.carts?.find(cart => cart.is_active);
            if (!activeCart || activeCart.cartItems.length === 0) throw new ValidationError("Your cart is empty.");

            const choosenAddress = await queryRunner.manager.findOne(Address, {
                where: { address_id: addressId, user: { id: userId } }
            })

            if (!choosenAddress) throw new NotFound("Address not found.")

            const order = queryRunner.manager.create(Orders, {
                user,
                totalAmount: 0,
                status: OrderStatus.Pending,
                address: choosenAddress,
            });

            let calculateTotal = 0;
            for (const item of activeCart.cartItems) {
                calculateTotal += Number(item.product.product_price) * Number(item.quantity);
            }

            order.totalAmount = calculateTotal;

            await queryRunner.manager.save(order);

            const orderItems = activeCart.cartItems.map(item => {
                return queryRunner.manager.create(OrderedProducts, {
                    quantity: item.quantity,
                    product: item.product,
                    price: item.product.product_price,
                    order: order,
                })
            })

            await queryRunner.manager.save(orderItems);
            activeCart.is_active = false;
            await queryRunner.manager.save(activeCart);

            const payment = queryRunner.manager.create(Payments, {
                order: order,
                amount_paid: order.totalAmount,
                payment_date: new Date(),
                payment_method,
                payment_status
            });

            await queryRunner.manager.save(payment);
            await queryRunner.commitTransaction();

            return await AppDataSource.getRepository(Orders).createQueryBuilder('orders')
                .leftJoinAndSelect('orders.orderProducts', 'items')
                .leftJoinAndSelect('items.product', 'product')
                .leftJoinAndSelect('orders.address', 'address')
                .select([
                    'orders.order_id',
                    'orders.totalAmount',
                    'orders.status',
                    'orders.createdAt',
                    'orders.updatedAt',
                    'items.quantity',
                    'items.price',
                    'product.product_name',
                    'address.address'
                ])
                .where('orders.order_id = :id', { id: order.order_id })
                .getOne();

        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    static async getOrdersByUser(userId: string, skip: number, limit: number) {
        return await this.orderRepo.findAndCount({
            skip: skip,
            take: limit,
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

    static async filterByDate(userId: string, startDate: Date, endDate: Date, skip: number, limit: number) {
        const qb = AppDataSource.getRepository(Orders).createQueryBuilder('orders')
        return qb
            .where('orders.user_id = :userId', { userId })
            .andWhere('orders.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .orderBy('orders.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
    }

    static async filterByStatus(userId: string, status: OrderStatus, limit: number, skip: number) {
        const qb = AppDataSource.getRepository(Orders).createQueryBuilder('orders')
        return qb
            .where('orders.user_id = :userId', { userId })
            .andWhere('orders.status = :status', { status })
            .orderBy('orders.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
    }

    static async filterByCategory(userId: string, category: string, limit: number, skip: number) {
        const qb = AppDataSource.getRepository(Orders).createQueryBuilder('orders')
        return qb
            .leftJoin('orders.orderProducts', 'orderProducts')
            .leftJoin('orderProducts.product', 'product')
            .leftJoin('product.subCategories', 'subCategory')
            .leftJoin('subCategory.categories', 'category')
            .leftJoin('category.types', 'type')
            .select(['orders.order_id', 'orders.totalAmount', 'orders.status', 'orders.createdAt', 'orders.updatedAt'])
            .where('orders.user_id = :userId', { userId })
            .andWhere('category.category_name LIKE :cat OR subCategory.subcategory_name LIKE :cat OR type.type_name LIKE :cat', { cat: `%${category}%` })
            .orderBy('orders.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
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