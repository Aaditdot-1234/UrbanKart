import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Address } from "./Address";
import { Orders } from "./Orders";
import { Reviews } from "./Reviews";
import { Cart } from "./Cart";

export enum UserRole {
    Guest = 'guest',
    Customer = 'customer',
    Admin = 'admin'
}


@Entity('users')
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 100, nullable: false })
    name!: string;

    @Column({ length: 100, unique: true, nullable: false })
    email!: string;

    @Column({ length: 100, unique: true, nullable: false, select: false })
    passwordHash!: string;

    @Column({ length: 20, nullable: false })
    phone!: string;

    @Column({ type: "simple-enum", enum: UserRole, default: UserRole.Guest })
    role!: UserRole;

    @Column({ default: false })
    isActive!: boolean;

    @Column({ select: false, default: false })
    isLocked!: boolean;

    @OneToMany(() => Address, (address) => address.user, { cascade: true })
    address!: Address[];

    @OneToMany(() => Orders, (order) => order.user, { cascade: true })
    orders!: Orders[];

    @OneToMany(() => Reviews, (review) => review.user, { cascade: true })
    reviews!: Reviews[];

    @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
    carts!: Cart[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}