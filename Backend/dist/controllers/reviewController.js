"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const asyncHandler_1 = require("../errors/asyncHandler");
const reviewService_1 = require("../services/reviewService");
class ReviewController {
}
exports.ReviewController = ReviewController;
_a = ReviewController;
ReviewController.addReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const { productId } = req.params;
    const { comments, rating } = req.body;
    const review = await reviewService_1.ReviewService.addReview(user.id, +productId, { comments, rating });
    res.status(201).json({
        message: "Review added successfully.",
        review,
    });
});
ReviewController.getReviews = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { reviews, total } = await reviewService_1.ReviewService.getReviewsByProduct(+productId, limit, skip);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
        message: "Reviews fetched successfully.",
        reviews,
        meta: {
            totalItems: total,
            itemCount: reviews.length,
            itemsPerPage: limit,
            totalPages: totalPages,
            currentPage: page,
        }
    });
});
ReviewController.deleteReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
    await reviewService_1.ReviewService.deleteReview(+reviewId, userId);
    res.status(200).json({
        message: "Review deleted successfully.",
    });
});
