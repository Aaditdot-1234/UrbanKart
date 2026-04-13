"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const asyncHandler_1 = require("../errors/asyncHandler");
const cartService_1 = require("../services/cartService");
const datasource_1 = __importDefault(require("../datasource"));
const Cart_1 = require("../entities/Cart");
class CartController {
}
exports.CartController = CartController;
_a = CartController;
CartController.addToCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { product_id, quantity } = req.body;
    const user = req.user;
    const activeCart = await cartService_1.CartService.addToCart(user.id, product_id, quantity);
    res.status(200).json({ message: "Product added to cart successfully.", activeCart });
});
CartController.updateCartItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { cart_item_id, quantity } = req.body;
    const user = req.user;
    const activeCart = await cartService_1.CartService.updateCartItem(user.id, +cart_item_id, quantity);
    res.status(200).json({ message: "Cart item updated successfully.", activeCart });
});
CartController.deleteCartItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { cart_item_id } = req.params;
    const user = req.user;
    const activeCart = await cartService_1.CartService.deleteCartItem(user.id, +cart_item_id);
    res.status(200).json({ message: "Cart item deleted successfully.", activeCart });
});
CartController.getActiveCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const cartRepo = datasource_1.default.getRepository(Cart_1.Cart);
    const activeCart = await cartRepo.findOne({
        where: {
            user: { id: user.id },
            is_active: true,
        },
        relations: ['cartItems', 'cartItems.product']
    });
    res.status(200).json({ message: "CartItems fetched successfully", activeCart });
});
CartController.calculateTotal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const total = await cartService_1.CartService.calculateTotal(user.id);
    res.status(200).json({ total });
});
