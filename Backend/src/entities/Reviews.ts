import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @Column({default:false})
    is_deleted!: boolean;

    @ManyToOne(() => Users, (user) => user.reviews)
    @JoinColumn({name: "user_id"})
    user!: Users;

    @ManyToOne(() => Products, (product) => product.reviews)
    @JoinColumn({name: "product_id"})
    product!: Products;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}