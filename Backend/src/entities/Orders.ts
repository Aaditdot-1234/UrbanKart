import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./Users";
import { OrderedProducts } from "./OrderedProducts";
import { Address } from "./Address";
import { Payments } from "./Payments";

export enum OrderStatus {
    Pending = 'pending',
    Shipped = 'shipped',
    Delivered = 'delivered',
    Cancelled = 'cancelled'
}

@Entity('orders')
export class Orders {

    @PrimaryGeneratedColumn()
    order_id !: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00 })
    totalAmount !: number;

    @Column({ type: "simple-enum", enum: OrderStatus, default: OrderStatus.Pending })
    status !: OrderStatus;

    @ManyToOne(() => Users, (user) => user.orders)
    @JoinColumn({ name: "user_id" })
    user!: Users;

    @OneToMany(() => OrderedProducts, (op) => op.order, { cascade: true })
    orderProducts!: OrderedProducts[];

    @ManyToOne(() => Address, (address) => address.orders)
    @JoinColumn({ name: "address_id" })
    address!: Address;

    @OneToOne(() => Payments, (payment) => payment.order)
    payment !: Payments;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}