import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Categories } from "./Categories";

@Entity('types')
export class Types {
    @PrimaryGeneratedColumn()
    type_id!: number;

    @Column({ length: 100, unique: true })
    type_name!: string;

    @OneToMany(() => Categories, (c) => c.types)
    categories !: Categories;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}