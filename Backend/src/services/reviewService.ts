import AppDataSource from "../datasource";
import { Reviews } from "../entities/Reviews";
import { Products } from "../entities/Products";
import { NotFound, UnauthorisedError } from "../errors/appError";

export class ReviewService {
    private static reviewRepo = AppDataSource.getRepository(Reviews);

    static async addReview(userId: string, productId: number, data: { comments: string, rating: number }) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const product = await queryRunner.manager.findOne(Products, {
                where: { product_id: productId }
            });

            if (!product) throw new NotFound("Product not found");

            const review = queryRunner.manager.create(Reviews, {
                comments: data.comments,
                rating: data.rating,
                user: { id: userId } as any,
                product: product,
            });

            const savedReview = await queryRunner.manager.save(review);
            await queryRunner.commitTransaction();
            return savedReview;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    static async getReviewsByProduct(productId: number) {
        const reviews = await this.reviewRepo.find({
            where: { product: { product_id: productId } },
            relations: ['user']
        });

        if (!reviews || reviews.length === 0) {
            throw new NotFound("No reviews found for this product");
        }

        return reviews;
    }

    static async deleteReview(reviewId: number, userId: string) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const review = await queryRunner.manager.findOne(Reviews, {
                where: { review_id: reviewId },
                relations: ['user']
            });

            if (!review) throw new NotFound("Review not found");

            if (review.user.id !== userId) {
                throw new UnauthorisedError("You are not authorized to delete this review");
            }

            review.is_deleted = true;

            await queryRunner.manager.save(review);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}