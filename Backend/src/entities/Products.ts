import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SubCategories } from "./SubCategories";
import { ProductImages } from "./ProductImages";
import { Reviews } from "./Reviews";
import { Cart } from "./Cart";
import { CartItems } from "./CartItems";
import { OrderedProducts } from "./OrderedProducts";

@Entity('products')
export class Products {
    @PrimaryGeneratedColumn()
    product_id!: number;

    @Column({ length: 150 })
    product_name!: string;

    @Column({ type: 'text' })
    product_description!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    product_price!: number;

    @Column({ type: 'date', nullable: true })
    manufacturing_date!: Date;

    @Column({ type: 'date', nullable: true })
    expiry_date!: Date;

    @Column()
    stock!: number

    @ManyToOne(() => SubCategories, (sub) => sub.products)
    subCategories!: SubCategories;

    @OneToMany(() => ProductImages, (images) => images.product)
    productImages!: ProductImages[];

    @OneToMany(() => CartItems, (item) => item.product)
    items!: CartItems[];

    @OneToMany(() => Reviews, (review) => review.product, { cascade: true })
    reviews!: Reviews[];

    @OneToMany(() => OrderedProducts, (op) => op.product)
    orderItems !: OrderedProducts;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}