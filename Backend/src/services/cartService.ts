import AppDataSource from "../datasource";
import { Cart } from "../entities/Cart";
import { CartItems } from "../entities/CartItems";
import { Products } from "../entities/Products";
import { Users } from "../entities/Users";
import { NotFound } from "../errors/appError";

export class CartService {
    static async addToCart(userId: string, productId: number, quantity: number) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(Users, {
                where: { id: userId },
                relations: ['carts', 'carts.cartItems', 'carts.cartItems.product']
            });

            if (!user) throw new NotFound("User not found");

            let activeCart = user.carts?.find(cart => cart.is_active);

            if (!activeCart) {
                activeCart = queryRunner.manager.create(Cart, {
                    user,
                    is_active: true,
                    cartItems: []
                });
                await queryRunner.manager.save(activeCart);
            }

            const product = await queryRunner.manager.findOne(Products, {
                where: { product_id: productId }
            });

            if (!product) throw new NotFound("Product not found");

            if (activeCart.cartItems.some(item => item.product.product_id === productId)) {
                throw new Error("Product already exists in cart");
            }

            const cartItem = queryRunner.manager.create(CartItems, {
                cart: activeCart,
                product: product,
                quantity: quantity
            });

            await queryRunner.manager.save(cartItem);
            await queryRunner.commitTransaction();
            return activeCart;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    static async updateCartItem(userId: string, cartItemId: number, quantity: number) {
        const cartItemRepo = AppDataSource.getRepository(CartItems);
        
        const item = await cartItemRepo.findOne({
            where: { cart_item_id: cartItemId, cart: { user: { id: userId }, is_active: true } }
        });

        if (!item) throw new NotFound("Cart item not found");

        item.quantity = quantity;
        return await cartItemRepo.save(item);
    }

    static async deleteCartItem(userId: string, cartItemId: number) {
        const cartItemRepo = AppDataSource.getRepository(CartItems);
        const item = await cartItemRepo.findOne({
            where: { cart_item_id: cartItemId, cart: { user: { id: userId }, is_active: true } }
        });

        if (!item) throw new NotFound("Cart item not found");
        return await cartItemRepo.remove(item);
    }

    static async calculateTotal(userId: string) {
        const user = await AppDataSource.getRepository(Users).findOne({
            where: { id: userId },
            relations: ['carts', 'carts.cartItems', 'carts.cartItems.product']
        });

        if (!user) throw new NotFound("User not found");
        const activeCart = user.carts?.find(cart => cart.is_active);
        if (!activeCart) throw new NotFound("Cart not found");

        return activeCart.cartItems.reduce((acc, item) => {
            return acc + (item.product.product_price * item.quantity);
        }, 0);
    }
}