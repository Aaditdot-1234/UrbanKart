import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Orders } from "./Orders";
import { Products } from "./Products";

@Entity('ordered-products')
export class OrderedProducts {
    @PrimaryGeneratedColumn()
    ordered_product_id !: number;

    @Column()
    quantity !: number;

    @Column({type: "decimal", precision: 10, scale: 2})
    price !: number;

    @ManyToOne(() => Orders, (order) => order.orderProducts)
    @JoinColumn({ name: "order_id" })
    order!: Orders;

    @ManyToOne(() => Products, (product) => product.orderItems)
    @JoinColumn({ name: "product_id" })
    product!: Products;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}