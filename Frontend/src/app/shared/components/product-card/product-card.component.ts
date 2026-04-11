import { Component, Input, OnDestroy } from '@angular/core';
import { Product } from '../../../models/product';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnDestroy{
  private destroy$ = new Subject<void>();
  @Input() productInfo!: Product;

  constructor( private cart:CartService, private toast: ToastService, private router: Router) {}

  handleAddToCart() {
    this.cart.addToCart(this.productInfo.product_id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.toast.showToast(200, res.message);
        this.cart.toggleCardVisibility();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  redirectTo(){
    this.router.navigate([`/products/productDetail/${this.productInfo.product_id}`])
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
