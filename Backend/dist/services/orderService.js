"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const datasource_1 = __importDefault(require("../datasource"));
const Address_1 = require("../entities/Address");
const OrderedProducts_1 = require("../entities/OrderedProducts");
const Orders_1 = require("../entities/Orders");
const Payments_1 = require("../entities/Payments");
const Users_1 = require("../entities/Users");
const appError_1 = require("../errors/appError");
const Products_1 = require("../entities/Products");
class OrderService {
    static async createOrder(userId, addressId) {
        const queryRunner = datasource_1.default.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOne(Users_1.Users, {
                where: { id: userId },
                relations: ['carts', 'carts.cartItems', 'carts.cartItems.product']
            });
            if (!user)
                throw new appError_1.NotFound("User not found");
            const activeCart = user.carts?.find(cart => cart.is_active);
            if (!activeCart || activeCart.cartItems.length === 0)
                throw new appError_1.ValidationError("Your cart is empty.");
            const choosenAddress = await queryRunner.manager.findOne(Address_1.Address, {
                where: { address_id: addressId, user: { id: userId } }
            });
            if (!choosenAddress)
                throw new appError_1.NotFound("Address not found.");
            const order = queryRunner.manager.create(Orders_1.Orders, {
                user,
                totalAmount: 0,
                status: Orders_1.OrderStatus.Pending,
                address: choosenAddress,
            });
            let calculateTotal = 0;
            for (const item of activeCart.cartItems) {
                calculateTotal += Number(item.product.product_price) * Number(item.quantity);
            }
            order.totalAmount = calculateTotal;
            await queryRunner.manager.save(order);
            const orderItems = activeCart.cartItems.map(item => {
                return queryRunner.manager.create(OrderedProducts_1.OrderedProducts, {
                    quantity: item.quantity,
                    product: item.product,
                    price: item.product.product_price,
                    order: order,
                });
            });
            for (const item of activeCart.cartItems) {
                const updateResult = await queryRunner.manager.createQueryBuilder()
                    .update(Products_1.Products)
                    .set({
                    stock: () => 'stock - :quantity'
                })
                    .where('product_id = :id', { id: item.product.product_id })
                    .andWhere('stock >= :quantity', { quantity: item.quantity })
                    .setParameter('quantity', item.quantity)
                    .execute();
                if (updateResult.affected === 0) {
                    throw new appError_1.ValidationError(`Product ${item.product.product_name} is out of stock.`);
                }
            }
            await queryRunner.manager.save(orderItems);
            activeCart.is_active = false;
            await queryRunner.manager.save(activeCart);
            const payment = queryRunner.manager.create(Payments_1.Payments, {
                order: order,
                amount_paid: order.totalAmount,
                payment_date: new Date(),
                payment_method: Payments_1.PaymentMethod.NotSelected,
                payment_status: Payments_1.PaymentStatus.Pending
            });
            await queryRunner.manager.save(payment);
            await queryRunner.commitTransaction();
            return await datasource_1.default.getRepository(Orders_1.Orders).createQueryBuilder('orders')
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
        }
        catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    static async createDirectOrder(userId, addressId, productId, quantity) {
        const queryRunner = datasource_1.default.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOne(Users_1.Users, { where: { id: userId } });
            const product = await queryRunner.manager.findOne(Products_1.Products, { where: { product_id: productId } });
            if (!user)
                throw new appError_1.NotFound("User not found");
            if (!product)
                throw new appError_1.NotFound("Product not found");
            if (quantity <= 0)
                throw new appError_1.ValidationError("Quantity must be at least 1.");
            const chosenAddress = await queryRunner.manager.findOne(Address_1.Address, {
                where: { address_id: addressId, user: { id: userId } }
            });
            if (!chosenAddress)
                throw new appError_1.NotFound("Address not found.");
            const totalAmount = Number(product.product_price) * quantity;
            const order = queryRunner.manager.create(Orders_1.Orders, {
                user,
                totalAmount,
                status: Orders_1.OrderStatus.Pending,
                address: chosenAddress,
            });
            await queryRunner.manager.save(order);
            const orderItem = queryRunner.manager.create(OrderedProducts_1.OrderedProducts, {
                quantity: quantity,
                product: product,
                price: product.product_price,
                order: order,
            });
            await queryRunner.manager.save(orderItem);
            const updateResult = await queryRunner.manager.createQueryBuilder()
                .update(Products_1.Products)
                .set({ stock: () => `stock - ${quantity}` })
                .where('product_id = :id', { id: productId })
                .andWhere('stock >= :quantity', { quantity })
                .execute();
            if (updateResult.affected === 0) {
                throw new appError_1.ValidationError(`Product ${product.product_name} is out of stock or insufficient quantity.`);
            }
            const payment = queryRunner.manager.create(Payments_1.Payments, {
                order: order,
                amount_paid: totalAmount,
                payment_date: new Date(),
                payment_method: Payments_1.PaymentMethod.NotSelected,
                payment_status: Payments_1.PaymentStatus.Pending
            });
            await queryRunner.manager.save(payment);
            await queryRunner.commitTransaction();
            return await datasource_1.default.getRepository(Orders_1.Orders).createQueryBuilder('orders')
                .leftJoinAndSelect('orders.orderProducts', 'items')
                .leftJoinAndSelect('items.product', 'product')
                .leftJoinAndSelect('orders.address', 'address')
                .select([
                'orders.order_id',
                'orders.totalAmount',
                'orders.status',
                'orders.createdAt',
                'items.quantity',
                'items.price',
                'product.product_name',
                'address.address'
            ])
                .where('orders.order_id = :id', { id: order.order_id })
                .getOne();
        }
        catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    static async getOrdersByUser(userId, skip, limit) {
        return await this.orderRepo.findAndCount({
            skip: skip,
            take: limit,
            where: { user: { id: userId } },
            relations: ['orderProducts', 'orderProducts.product']
        });
    }
    static async getOrderById(orderId) {
        const order = await this.orderRepo.findOne({
            where: { order_id: orderId },
            relations: ['orderProducts', 'orderProducts.product', 'address']
        });
        if (!order)
            throw new appError_1.NotFound("Order not found");
        return order;
    }
    static async filterByDate(userId, startDate, endDate, skip, limit) {
        const qb = datasource_1.default.getRepository(Orders_1.Orders).createQueryBuilder('orders');
        return qb
            .where('orders.user_id = :userId', { userId })
            .andWhere('orders.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .orderBy('orders.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
    }
    static async filterByStatus(userId, status, limit, skip) {
        const qb = datasource_1.default.getRepository(Orders_1.Orders).createQueryBuilder('orders');
        return qb
            .where('orders.user_id = :userId', { userId })
            .andWhere('orders.status = :status', { status })
            .orderBy('orders.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
    }
    static async updateStatus(orderId, payment_method) {
        const order = await this.orderRepo.findOne({
            where: { order_id: orderId },
            relations: ['payment']
        });
        if (!order)
            throw new appError_1.NotFound("Order");
        if (order.status === Orders_1.OrderStatus.Delivered || order.status === Orders_1.OrderStatus.Cancelled || order.status === Orders_1.OrderStatus.Completed) {
            throw new appError_1.ValidationError(`Cannot update a ${order.status} order.`);
        }
        order.status = Orders_1.OrderStatus.Completed;
        if (payment_method === 'Cash on Delivery') {
            order.payment.payment_method = Payments_1.PaymentMethod.Cash;
        }
        else if (payment_method === 'Online') {
            order.payment.payment_method = Payments_1.PaymentMethod.Online;
        }
        else if (payment_method === 'Bank Transfer') {
            order.payment.payment_method = Payments_1.PaymentMethod.Bank;
        }
        else if (payment_method === 'Debit Card') {
            order.payment.payment_method = Payments_1.PaymentMethod.Debit;
        }
        else if (payment_method === 'Credit Card') {
            order.payment.payment_method = Payments_1.PaymentMethod.Credit;
        }
        else {
            throw new appError_1.ValidationError("Invalid payment method");
        }
        if (order.payment.payment_method === Payments_1.PaymentMethod.Cash) {
            order.payment.payment_status = Payments_1.PaymentStatus.Pending;
        }
        else {
            order.payment.payment_status = Payments_1.PaymentStatus.Completed;
            order.payment.payment_date = new Date();
        }
        return await this.orderRepo.save(order);
    }
}
exports.OrderService = OrderService;
OrderService.orderRepo = datasource_1.default.getRepository(Orders_1.Orders);
