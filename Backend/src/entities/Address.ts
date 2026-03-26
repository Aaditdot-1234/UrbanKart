import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./Users";
import { Orders } from "./Orders";

@Entity('address')
export class Address{

    @PrimaryGeneratedColumn()
    address_id !: number;

    @Column({type: "text"})
    address!: string;

    @ManyToOne(() => Users, (user) => user.address)
    user!: Users

    @OneToMany(() => Orders, (o) => o.address)
    orders!: Orders[]; 

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date; 
}