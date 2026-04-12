import { Meta, User } from "./auth";
import { Product } from "./product";

export interface Reviews<Tuser = User> {
    rating: number;
    comments: string;
    user: Tuser;
    product: Product;
    review_id: number;
    is_delted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviews {
    message: string;
    review: Reviews;
}

export interface GetReviews<Tuser = User> {
    message: string;
    reviews: Omit<Reviews<Tuser>, 'product'>[];
    meta: Meta;
}