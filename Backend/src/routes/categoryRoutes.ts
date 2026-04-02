import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";

const categoryRoutes = Router();

categoryRoutes.get('/filter', CategoryController.filterProducts);
categoryRoutes.get('/get-all', CategoryController.getAllCategories);
categoryRoutes.get('/get-all-subcategories', CategoryController.getAllSubCategories);
categoryRoutes.get('/get-all-types', CategoryController.getAllTypes);
categoryRoutes.get('/get-by-product/:product_id', CategoryController.getCategoryByProduct);

export default categoryRoutes;