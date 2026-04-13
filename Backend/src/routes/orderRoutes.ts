import { Router } from "express";
import { OrderController } from "../controllers/orderController";

const orderRouter = Router();

orderRouter.post('/create', OrderController.creationOfOrder);
orderRouter.post('/buyNow', OrderController.creationOfDirectOrder);
orderRouter.get('/get-all', OrderController.getAllOrders);
orderRouter.get('/get-by-id/:orderId', OrderController.getOrderById);
orderRouter.patch('/update-status', OrderController.updateOrderStatus);
orderRouter.get('/filter-by-date', OrderController.filterorderbyDate)
orderRouter.get('/filter-by-status', OrderController.filterOrderByStatus)


export default orderRouter;