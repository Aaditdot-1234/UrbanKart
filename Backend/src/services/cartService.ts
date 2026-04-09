import AppDataSource from "../datasource";
import { Cart } from "../entities/Cart";
import { CartItems } from "../entities/CartItems";
import { Products } from "../entities/Products";
import { Users } from "../entities/Users";
import { NotFound } from "../errors/appError";

export class CartService {
    static async addToCart(userId: string, productId: number, quantity: number = 1) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let activeCart = await queryRunner.manager.findOne(Cart, {
                where: {
                    user : { id: userId },
                    is_active: true
                },
                relations: ['cartItems', 'cartItems.product']
            });

            if (!activeCart) {
                let user = await queryRunner.manager.findOne(Users,{
                    where: {id: userId}
                })
                if(!user) throw new NotFound('User not found');

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
            return await this.getActiveCartWithRelations(userId);
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
        await cartItemRepo.save(item);

        return await this.getActiveCartWithRelations(userId);
    }

    static async deleteCartItem(userId: string, cartItemId: number) {
        const cartItemRepo = AppDataSource.getRepository(CartItems);
        const item = await cartItemRepo.findOne({
            where: { cart_item_id: cartItemId, cart: { user: { id: userId }, is_active: true } }
        });

        if (!item) throw new NotFound("Cart item not found");
        await cartItemRepo.remove(item);

        return await this.getActiveCartWithRelations(userId);
    }

    static async calculateTotal(userId: string) {
        const activeCart = await AppDataSource.getRepository(Cart).findOne({
            where: {
                user: { id: userId },
                is_active: true
            },
            relations: ['cartItems', 'cartItems.product']
        });

        if (!activeCart) throw new NotFound("Cart not found");

        return activeCart.cartItems.reduce((acc, item) => {
            const price = item.product.product_price || 0;
            const quantity = item.quantity || 0;
            return acc + (price * quantity);
        }, 0);
    }

    private static async getActiveCartWithRelations(userId: string) {
        const cartRepo = AppDataSource.getRepository(Cart);

        return await cartRepo.findOne({
            where: {
                user: { id: userId },
                is_active: true
            },
            relations: [
                'cartItems',
                'cartItems.product'
            ]
        })
    }
}