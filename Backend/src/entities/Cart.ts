import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./Users";
import { CartItems } from "./CartItems";

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    cart_id!: number;

    @Column({ default: true })
    is_active!: boolean;

    @ManyToOne(() => Users, (user) => user.carts)
    @JoinColumn({name: "user_id"})
    user!: Users;

    @OneToMany(() => CartItems, (item) => item.cart)
    cartItems!: CartItems[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}