import { Router } from "express";
import { requireAuth } from "../middleware/authMidlleware";
import { OrderController } from "../controllers/orderController";

const orderRouter = Router();

orderRouter.post('/create', requireAuth, OrderController.createOrder);
orderRouter.get('/get-all', requireAuth, OrderController.getAllOrders);
orderRouter.get('/get-by-id/:id', requireAuth, OrderController.getOrderById);
orderRouter.patch('/update-status/:id', requireAuth, OrderController.updateOrderStatus);


export default orderRouter;
