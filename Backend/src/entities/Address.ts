import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./Users";
import { Orders } from "./Orders";

@Entity('address')
export class Address {

    @PrimaryGeneratedColumn()
    address_id !: number;

    @Column({ length: 50, default: 'Home' })
    address_title!: string;

    @Column({ default: false })
    is_default!: boolean;

    @Column({ type: "text" })
    address!: string;

    @Column({ default: false })
    is_deleted!: boolean;

    @ManyToOne(() => Users, (user) => user.address)
    @JoinColumn({ name: 'user_id' })
    user!: Users

    @OneToMany(() => Orders, (o) => o.address)
    orders!: Orders[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}