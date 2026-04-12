import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";
import { requireAdmin } from "../middleware/authMidlleware";

const paymentRoutes = Router();

paymentRoutes.get('/get-all', requireAdmin, PaymentController.getAllPayments);
paymentRoutes.get('/get-by-id/:paymentId', requireAdmin, PaymentController.getPaymentById);
paymentRoutes.get('/get-by-order/:orderId', PaymentController.getPaymentByOrder);
paymentRoutes.get('/get-my-payments', PaymentController.getMyPayments);

export default paymentRoutes;