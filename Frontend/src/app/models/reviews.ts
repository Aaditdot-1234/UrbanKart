import { Meta, User } from "./auth";
import { Product } from "./product";

export interface Reviews {
    rating: number;
    comments: string;
    user: Pick<User, 'id'> | User;
    product: Product;
    review_id: number;
    is_delted: boolean;
    createdAt: string;
    updatedAt:string;
}

export interface CreateReviews{
    message: string;
    review: Reviews;
}

export interface GetReviews{
    message: string;
    review: Omit<Reviews, 'product'>;
    meta: Meta;
}