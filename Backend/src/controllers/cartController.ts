import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { CartService } from "../services/cartService";
import { Users } from "../entities/Users";

export class CartController {
    static addToCart = asyncHandler(async (req: Request, res: Response) => {
        const { product_id, quantity } = req.body;
        const user = req.user as Users;

        await CartService.addToCart(user.id, product_id, quantity);
        res.status(200).json({ message: "Product added to cart successfully." });
    });

    static updateCartItem = asyncHandler(async (req: Request, res: Response) => {
        const { cart_item_id, quantity } = req.body;
        const user = req.user as Users;

        await CartService.updateCartItem(user.id, cart_item_id, quantity);
        res.status(200).json({ message: "Cart item updated successfully." });
    });

    static deleteCartItem = asyncHandler(async (req: Request<{ cart_item_id: string }>, res: Response) => {
        const { cart_item_id } = req.params;
        const user = req.user as Users;

        await CartService.deleteCartItem(user.id, +cart_item_id);
        res.status(200).json({ message: "Cart item deleted successfully." });
    });

    static calculateTotal = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as Users;
        const total = await CartService.calculateTotal(user.id);
        res.status(200).json({ total });
    });
}