import { Router } from "express";
import { ReviewController } from "../controllers/reviewController";

const reviewRouter = Router();

reviewRouter.post('/create/:productId', ReviewController.addReview);
reviewRouter.get('/get-all/:productId', ReviewController.getReviews);
reviewRouter.delete('/delete/:reviewId', ReviewController.deleteReview);

export default reviewRouter;