import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { ReviewService } from "../services/reviewService";
import { Users } from "../entities/Users";

export class ReviewController {
    static addReview = asyncHandler(async (req: Request<{ productId: number }>, res: Response) => {
        const user = req.user as Users;
        const { productId } = req.params;
        const { comments, rating } = req.body;

        const review = await ReviewService.addReview(user.id, +productId, { comments, rating });

        res.status(201).json({
            message: "Review added successfully.",
            review,
        });
    });

    static getReviews = asyncHandler(async (req: Request<{ productId: string }>, res: Response) => {
        const { productId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const { reviews, total } = await ReviewService.getReviewsByProduct(+productId, limit, skip);

        const totalPages = Math.ceil(total / limit)
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

    static deleteReview = asyncHandler(async (req: Request<{ reviewId: string }>, res: Response) => {
        const { reviewId } = req.params;
        const userId = (req as any).user.id;

        await ReviewService.deleteReview(+reviewId, userId);

        res.status(200).json({
            message: "Review deleted successfully.",
        });
    });
}