import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/authMidlleware";
import { ProductController } from "../controllers/productController";

const productRouter = Router();

productRouter.post('/create', requireAuth, requireAdmin, ProductController.createProduct);
productRouter.patch('/update/:id', requireAuth, requireAdmin, ProductController.updateProduct);
productRouter.delete('/delete/:id', requireAuth, requireAdmin, ProductController.deleteProduct);
productRouter.get('/get-all', ProductController.getAllProducts);
productRouter.get('/get-by-id/:id', ProductController.getProductById);

export default productRouter;
