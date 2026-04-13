"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const datasource_1 = __importDefault(require("../datasource"));
const Cart_1 = require("../entities/Cart");
const CartItems_1 = require("../entities/CartItems");
const Products_1 = require("../entities/Products");
const Users_1 = require("../entities/Users");
const appError_1 = require("../errors/appError");
class CartService {
    static async addToCart(userId, productId, quantity = 1) {
        const queryRunner = datasource_1.default.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let activeCart = await queryRunner.manager.findOne(Cart_1.Cart, {
                where: {
                    user: { id: userId },
                    is_active: true
                },
                relations: ['cartItems', 'cartItems.product']
            });
            if (!activeCart) {
                let user = await queryRunner.manager.findOne(Users_1.Users, {
                    where: { id: userId }
                });
                if (!user)
                    throw new appError_1.NotFound('User not found');
                activeCart = queryRunner.manager.create(Cart_1.Cart, {
                    user,
                    is_active: true,
                    cartItems: []
                });
                await queryRunner.manager.save(activeCart);
            }
            const product = await queryRunner.manager.findOne(Products_1.Products, {
                where: { product_id: productId }
            });
            if (!product)
                throw new appError_1.NotFound("Product not found");
            if (activeCart.cartItems.some(item => item.product.product_id === productId)) {
                throw new Error("Product already exists in cart");
            }
            const cartItem = queryRunner.manager.create(CartItems_1.CartItems, {
                cart: activeCart,
                product: product,
                quantity: quantity
            });
            await queryRunner.manager.save(cartItem);
            await queryRunner.commitTransaction();
            return await this.getActiveCartWithRelations(userId);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    static async updateCartItem(userId, cartItemId, quantity) {
        const cartItemRepo = datasource_1.default.getRepository(CartItems_1.CartItems);
        const item = await cartItemRepo.findOne({
            where: { cart_item_id: cartItemId, cart: { user: { id: userId }, is_active: true } }
        });
        if (!item)
            throw new appError_1.NotFound("Cart item not found");
        item.quantity = quantity;
        await cartItemRepo.save(item);
        return await this.getActiveCartWithRelations(userId);
    }
    static async deleteCartItem(userId, cartItemId) {
        const cartItemRepo = datasource_1.default.getRepository(CartItems_1.CartItems);
        const item = await cartItemRepo.findOne({
            where: { cart_item_id: cartItemId, cart: { user: { id: userId }, is_active: true } }
        });
        if (!item)
            throw new appError_1.NotFound("Cart item not found");
        await cartItemRepo.remove(item);
        return await this.getActiveCartWithRelations(userId);
    }
    static async calculateTotal(userId) {
        const activeCart = await datasource_1.default.getRepository(Cart_1.Cart).findOne({
            where: {
                user: { id: userId },
                is_active: true
            },
            relations: ['cartItems', 'cartItems.product']
        });
        if (!activeCart)
            throw new appError_1.NotFound("Cart not found");
        return activeCart.cartItems.reduce((acc, item) => {
            const price = item.product.product_price || 0;
            const quantity = item.quantity || 0;
            return acc + (price * quantity);
        }, 0);
    }
    static async getActiveCartWithRelations(userId) {
        const cartRepo = datasource_1.default.getRepository(Cart_1.Cart);
        return await cartRepo.findOne({
            where: {
                user: { id: userId },
                is_active: true
            },
            relations: [
                'cartItems',
                'cartItems.product'
            ]
        });
    }
}
exports.CartService = CartService;
