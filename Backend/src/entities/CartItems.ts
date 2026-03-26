import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Products } from "./Products";
import { Cart } from "./Cart";

@Entity('cart-items')
export class CartItems {
    @PrimaryGeneratedColumn()
    cart_item_id!: number;

    @Column({ default: 1 })
    quantity!: number;

    @ManyToOne(() => Products, (product) => product.items)
    product!: Products;

    @ManyToOne(() => Cart, (cart) => cart.cartItems)
    cart!: Cart;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}