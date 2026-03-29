import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Orders } from "./Orders";
import { Products } from "./Products";

@Entity('ordered-products')
export class OrderedProducts {
    @PrimaryGeneratedColumn()
    ordered_product_id !: number;

    @Column()
    quantity !: number;

    @Column()
    price !: number;

    @ManyToOne(() => Orders, (order) => order.orderProducts)
    order!: Orders;

    @ManyToOne(() => Products, (product) => product.orderItems)
    product!: Products;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}