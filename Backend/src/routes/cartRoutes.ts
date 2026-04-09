import { Router } from "express";
import { CartController } from "../controllers/cartController";

const cartRoutes = Router();

cartRoutes.post('/add', CartController.addToCart);
cartRoutes.patch('/update', CartController.updateCartItem);
cartRoutes.delete('/delete/:cart_item_id', CartController.deleteCartItem);
cartRoutes.get('/get-cart', CartController.getActiveCart);
cartRoutes.get('/total', CartController.calculateTotal);

export default cartRoutes;