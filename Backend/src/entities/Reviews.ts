import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./Users";
import { Products } from "./Products";

@Entity('reviews')
export class Reviews {
    @PrimaryGeneratedColumn()
    review_id!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00 })
    rating!: number;

    @Column({ type: "text" })
    comments!: string;

    @ManyToOne(() => Users, (user) => user.reviews)
    user!: Users;

    @ManyToOne(() => Products, (product) => product.reviews)
    product!: Products;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}