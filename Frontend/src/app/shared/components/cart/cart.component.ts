import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProductCardComponent } from "../product-card/product-card.component";
import { Product } from '../../../models/product';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cart',
  imports: [AsyncPipe, ProductCardComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  subTotal!: number;
  products: Product[] = [
    {
      product_id: 101,
      product_name: "Ultra-Wide Gaming Monitor",
      product_description: "34-inch curved OLED display.",
      product_price: 899.99,
      stock: 25,
      manufacturing_date: "2025-11-15T10:00:00Z",
      expiry_date: null,
      is_deleted: false,
      createdAt: "2026-01-10T08:30:00Z",
      updatedAt: "2026-01-10T08:30:00Z"
    },
    {
      product_id: 102,
      product_name: "Organic Matcha Green Tea",
      product_description: "Stone-ground matcha powder.",
      product_price: 45.00,
      stock: 150,
      manufacturing_date: "2026-03-01T12:00:00Z",
      expiry_date: "2027-03-01T12:00:00Z",
      is_deleted: false,
      createdAt: "2026-04-05T14:20:00Z",
      updatedAt: "2026-04-05T14:20:00Z"
    }
  ]

  constructor(public cart: CartService, private toast: ToastService) { }

  ngOnInit(): void {
    this.cart.cart$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(activeCart => {
      if (activeCart && activeCart.cartItems && activeCart.cartItems.length > 0) {
        this.fetchTotal();
      } else {
        this.subTotal = 0;
      }
    });
  }

  fetchTotal() {
    this.cart.calculateTotal().pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (res) => {
        this.subTotal = res.total;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  removeCartItem(itemId: number){
    this.cart.deleteFromCart(itemId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.toast.showToast(0, res.message);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
