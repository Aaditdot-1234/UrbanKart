import AppDataSource from "../datasource";
import { Cart } from "../entities/Cart";
import { CartItems } from "../entities/CartItems";
import { Products } from "../entities/Products";
import { Users } from "../entities/Users";
import { NotFound } from "../errors/appError";
import { asyncHandler } from "../errors/asyncHandler";
import { NextFunction, Request, Response } from "express";

export class CartController {
    static addToCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { product_id, quantity } = req.body;
        const loggedUserInfo = (req as any).user;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(Users, {
                where: { id: loggedUserInfo.id },
                relations: ['cart', 'cart.cartItems', 'cart.cartItems.product']
            });

            if (!user) {
                throw new NotFound("User not found");
            }

            let activeCart = user.carts.find(cart => cart.is_active);

            if (!activeCart) {
                activeCart = queryRunner.manager.create(Cart, {
                    user: user,
                    is_active: true,
                    cartItems: []
                });
            }

            const product = await queryRunner.manager.findOne(Products, {
                where: { product_id: product_id }
            });

            if (!product) {
                throw new NotFound("Product not found");
            }

            if (activeCart.cartItems.some(item => item.product.product_id === product_id)) {
                throw new Error("Product already exists in cart");
            }

            const cartItem = queryRunner.manager.create(CartItems, {
                cart: activeCart,
                product: product,
                quantity: quantity
            });

            activeCart.cartItems.push(cartItem);

            await queryRunner.manager.save(activeCart);

            await queryRunner.commitTransaction();
            res.status(200).json({ message: "Product added to cart successfully." });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    })

    static updateCartItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { cart_item_id, quantity } = req.body;
        const loggedUserInfo = (req as any).user;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(Users, {
                where: { id: loggedUserInfo.id },
                relations: ['cart', 'cart.cartItems', 'cart.cartItems.product']
            });

            if (!user) {
                throw new NotFound("User not found");
            }

            let activeCart = user.carts.find(cart => cart.is_active);

            if (!activeCart) {
                throw new NotFound("Cart not found");
            }

            const cartItem = activeCart.cartItems.find(item => item.cart_item_id === cart_item_id);

            if (!cartItem) {
                throw new NotFound("Cart item not found");
            }

            cartItem.quantity = quantity;

            await queryRunner.manager.save(activeCart);

            await queryRunner.commitTransaction();
            res.status(200).json({ message: "Cart item updated successfully." });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    })

    static deleteCartItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { cart_item_id } = req.params;
        const loggedInUserInfo = (req as any).user;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(Users, {
                where: { id: loggedInUserInfo.id },
                relations: ['cart', 'cart.cartItems', 'cart.cartItems.product']
            });

            if (!user) {
                throw new NotFound("User not found");
            }

            await queryRunner.commitTransaction();
            res.status(200).json({ message: "Cart item deleted successfully." });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    })

    static calculateTotal = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const loggedInUserInfo = (req as any).user;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(Users, {
                where: { id: loggedInUserInfo.id },
                relations: ['cart', 'cart.cartItems', 'cart.cartItems.product']
            });

            if (!user) {
                throw new NotFound("User not found");
            }

            let activeCart = user.carts.find(cart => cart.is_active);

            if (!activeCart) {
                throw new NotFound("Cart Not found");
            }

            const total = activeCart.cartItems.reduce((acc, item) => acc + item.product.product_price * item.quantity, 0);

            await queryRunner.commitTransaction();
            res.status(200).json({ total });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    })
}