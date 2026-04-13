"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const datasource_1 = __importDefault(require("../datasource"));
const Reviews_1 = require("../entities/Reviews");
const Products_1 = require("../entities/Products");
const appError_1 = require("../errors/appError");
class ReviewService {
    static async addReview(userId, productId, data) {
        const queryRunner = datasource_1.default.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const product = await queryRunner.manager.findOne(Products_1.Products, {
                where: { product_id: productId }
            });
            if (!product)
                throw new appError_1.NotFound("Product not found");
            const review = queryRunner.manager.create(Reviews_1.Reviews, {
                comments: data.comments,
                rating: data.rating,
                user: { id: userId },
                product: product,
            });
            const savedReview = await queryRunner.manager.save(review);
            await queryRunner.commitTransaction();
            return savedReview;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    static async getReviewsByProduct(productId, limit, skip) {
        const [reviews, total] = await this.reviewRepo.findAndCount({
            skip: skip,
            take: limit,
            where: { product: { product_id: productId } },
            relations: ['user']
        });
        if (!reviews || reviews.length === 0) {
            throw new appError_1.NotFound("No reviews found for this product");
        }
        return { reviews, total };
    }
    static async deleteReview(reviewId, userId) {
        const queryRunner = datasource_1.default.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const review = await queryRunner.manager.findOne(Reviews_1.Reviews, {
                where: { review_id: reviewId },
                relations: ['user']
            });
            if (!review)
                throw new appError_1.NotFound("Review not found");
            if (review.user.id !== userId) {
                throw new appError_1.UnauthorisedError("You are not authorized to delete this review");
            }
            review.is_deleted = true;
            await queryRunner.manager.save(review);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.ReviewService = ReviewService;
ReviewService.reviewRepo = datasource_1.default.getRepository(Reviews_1.Reviews);
