import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SubCategories } from "./SubCategories";
import { Types } from "./Types";

@Entity('categories')
export class Categories {
    @PrimaryGeneratedColumn()
    category_id!: number;

    @Column({ length: 100, unique: true })
    category_name!: string;

    @Column({ type: "text" })
    category_description!: string;

    @OneToMany(() => SubCategories, (sc) => sc.categories)
    subCategory!: SubCategories[];

    @ManyToOne(() => Types, (t) => t.categories)
    @JoinColumn({ name: "type_id" })
    types!: Types;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}