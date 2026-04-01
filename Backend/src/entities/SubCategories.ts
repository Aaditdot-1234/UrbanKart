import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Products } from "./Products";
import { Categories } from "./Categories";

@Entity('sub-categories')
export class SubCategories {
    @PrimaryGeneratedColumn()
    subcategory_id!: number;

    @Column({ length: 100, unique: true })
    subcategory_name!: string;
    
    @Column({ type: "text" })
    subcategory_description!: string;

    @OneToMany(() => Products, (product) => product.subCategories)
    products!: Products[];

    @ManyToOne(() => Categories, (category) => category.subCategory)
    @JoinColumn({ name: "category_id" })
    categories!: Categories;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}