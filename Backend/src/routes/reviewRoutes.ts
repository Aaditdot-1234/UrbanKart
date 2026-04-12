import { Router } from "express";
import { ReviewController } from "../controllers/reviewController";
import { requireAuth } from "../middleware/authMidlleware";

const reviewRouter = Router();

reviewRouter.post('/create/:productId', requireAuth, ReviewController.addReview);
reviewRouter.get('/get-all/:productId', ReviewController.getReviews);
reviewRouter.delete('/delete/:reviewId', requireAuth, ReviewController.deleteReview);

export default reviewRouter;