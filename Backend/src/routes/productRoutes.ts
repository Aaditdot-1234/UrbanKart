import { Router } from "express";
import { requireAdmin } from "../middleware/authMidlleware";
import { ProductController } from "../controllers/productController";

const productRouter = Router();

productRouter.post('/create', requireAdmin, ProductController.createProduct);
productRouter.patch('/update/:id', requireAdmin, ProductController.updateProduct);
productRouter.delete('/delete/:id', requireAdmin, ProductController.deleteProduct);
productRouter.get('/get-all', ProductController.getAllProducts);
productRouter.get('/get-by-id/:id', ProductController.getProductById);

export default productRouter;
