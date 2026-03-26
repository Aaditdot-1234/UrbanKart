import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import { Orders } from "./Orders";
import { Products } from "./Products";

@Entity('ordered-products')
export class OrderedProducts{
    @Column()
    quantity !: number;

    @ManyToOne(() => Orders, (order) => order.orderProducts)
    order!: Orders;

    @ManyToOne(() => Products, (product) => product.orderItems)
    product!: Products;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}