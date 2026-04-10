import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { CartService } from "../services/cartService";
import { Users } from "../entities/Users";
import AppDataSource from "../datasource";
import { Cart } from "../entities/Cart";

export class CartController {
    static addToCart = asyncHandler(async (req: Request<{}, any, {product_id: number, quantity?: number}>, res: Response) => {
        const { product_id, quantity } = req.body;
        const user = req.user as Users;

        const activeCart = await CartService.addToCart(user.id, product_id, quantity);
        res.status(200).json({ message: "Product added to cart successfully.", activeCart });
    });

    static updateCartItem = asyncHandler(async (req: Request<{}, any, { cart_item_id: number, quantity: number }>, res: Response) => {
        const { cart_item_id, quantity } = req.body;
        const user = req.user as Users;

        const activeCart = await CartService.updateCartItem(user.id, +cart_item_id, quantity);
        res.status(200).json({ message: "Cart item updated successfully.", activeCart });
    });

    static deleteCartItem = asyncHandler(async (req: Request, res: Response) => {
        const { cart_item_id } = req.params;
        const user = req.user as Users;

        const activeCart = await CartService.deleteCartItem(user.id, +cart_item_id);
        res.status(200).json({ message: "Cart item deleted successfully.", activeCart });
    });

    static getActiveCart = asyncHandler(async (req:Request, res:Response) => {
        const user = req.user as Users;
        const cartRepo = AppDataSource.getRepository(Cart);
        
        const activeCart = await cartRepo.findOne({
            where: {
                user: {id: user.id},
                is_active: true,
            },
            relations: ['cartItems', 'cartItems.product']
        })

        res.status(200).json({message: "CartItems fetched successfully", activeCart});
    })

    static calculateTotal = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as Users;
        const total = await CartService.calculateTotal(user.id);
        res.status(200).json({ total });
    });
}