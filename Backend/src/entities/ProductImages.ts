import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Products } from "./Products";

@Entity('product-images')
export class ProductImages {
    @PrimaryGeneratedColumn()
    image_id!: number;

    @Column({ length: 100 })
    image_path!: string;

    @Column({ default: false })
    is_primary!: boolean;

    @ManyToOne(() => Products, (product) => product.productImages)
    @JoinColumn({ name: "product_id" })
    product !: Products; 

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}