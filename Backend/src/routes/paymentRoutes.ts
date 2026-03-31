import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";
import { requireAdmin } from "../middleware/authMidlleware";

const paymentRoutes = Router();

paymentRoutes.get('/get-all', requireAdmin, PaymentController.getAllPayments);
paymentRoutes.get('/get-by-id/:id', requireAdmin, PaymentController.getPaymentById);
paymentRoutes.patch('/update/:id', requireAdmin, PaymentController.updatePayment);
paymentRoutes.get('/get-by-order/:id', PaymentController.getPaymentByOrder);
paymentRoutes.get('/get-my-payments', PaymentController.getMyPayments);

export default paymentRoutes;