import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Orders } from "./Orders";

export enum PaymentMethod {
    Credit = 'Credit Card',
    Debit = 'Debit Card',
    Cash = 'Cash on Delivery',
    Bank = 'Bank Transfer',
    Online = 'Online',
    NotSelected = 'not selected'
}

export enum PaymentStatus {
    Pending = "pending",
    Completed = "completed",
    Cancelled = 'cancelled',
    Refunded = "Refunded",
}

@Entity('payments')
export class Payments {

    @PrimaryGeneratedColumn()
    payment_id !: number;

    @Column({type: 'decimal', precision: 10, scale: 2})
    amount_paid !: number;

    @Column()
    payment_date !: Date;

    @Column({ type: 'simple-enum', enum: PaymentMethod, default: PaymentMethod.Bank })
    payment_method !: PaymentMethod;

    @Column({ type: 'simple-enum', enum: PaymentStatus, default: PaymentStatus.Pending })
    payment_status !: PaymentStatus;

    @OneToOne(() => Orders, (order) => order.payment)
    @JoinColumn({ name: 'order_id' })
    order!: Orders;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}