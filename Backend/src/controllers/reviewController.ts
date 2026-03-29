import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import AppDataSource from "../datasource";
import { Reviews } from "../entities/Reviews";
import { NotFound } from "../errors/appError";
import { Products } from "../entities/Products";

export class ReviewController {
    static addReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const LoggedInUser = (req as any).user;
        const { productId } = req.params;
        const { comments, rating } = req.body;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const product = await queryRunner.manager.findOne(Products, {
                where: { product_id: +productId }
            });

            if (!product) {
                throw new NotFound("Product not found");
            }

            const reviewInfo = queryRunner.manager.create(Reviews, {
                comments: comments,
                rating: rating,
                user: LoggedInUser,
                product: product,
            })

            await queryRunner.manager.save(reviewInfo);
            await queryRunner.commitTransaction();

            res.status(201).json({
                message: "Review added successfully.",
                review: reviewInfo,
            })
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    })

    static getReviews = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params;
        const reviewRepo = AppDataSource.getRepository(Reviews);
        const reviews = await reviewRepo.find({
            where: { product: { product_id: +productId } },
            relations: ['user']
        })

        if (!reviews) {
            throw new NotFound("No reviews found for this product");
        }

        res.status(200).json({
            message: "Reviews fetched successfully.",
            reviews,
        })
    })

    static deleteReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { reviewId } = req.params;
        const LoggedInUser = (req as any).user;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const review = await queryRunner.manager.findOne(Reviews, {
                where: { review_id: +reviewId },
                relations: ['user']
            })

            if (!review) {
                throw new NotFound("Review not found");
            }

            if (review.user.id !== LoggedInUser.id) {
                throw new Error("You are not authorized to delete this review");
            }

            await queryRunner.manager.remove(review);
            await queryRunner.commitTransaction();

            res.status(200).json({
                message: "Review deleted successfully.",
            })
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    })
}