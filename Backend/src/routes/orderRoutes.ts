import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { requireAdmin } from "../middleware/authMidlleware";

const orderRouter = Router();

orderRouter.post('/create', OrderController.createOrder);
orderRouter.get('/get-all', OrderController.getAllOrders);
orderRouter.get('/get-by-id/:id', OrderController.getOrderById);
orderRouter.patch('/update-status/:id', requireAdmin, OrderController.updateOrderStatus);


export default orderRouter;
