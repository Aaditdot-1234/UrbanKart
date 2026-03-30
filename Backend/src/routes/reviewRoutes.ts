import { Router } from "express";
import { ReviewController } from "../controllers/reviewController";

const reviewRouter = Router();

reviewRouter.post('/create', ReviewController.addReview);
reviewRouter.get('/get-all', ReviewController.getReviews);
reviewRouter.delete('/delete/:id', ReviewController.deleteReview);

export default reviewRouter;

