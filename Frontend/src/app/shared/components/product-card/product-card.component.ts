import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Product } from '../../../models/product';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { ProductService } from '../../../Products/product.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ToggleVisibilityDirective } from "../../Directives/toggle-visibility.directive";
import { AuthService } from '../../../Auth/auth.service';

@Component({
  selector: 'app-product-card',
  imports: [TruncatePipe, ToggleVisibilityDirective],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnDestroy{
  private destroy$ = new Subject<void>();
  @Input() productInfo!: Product;
  @Output() sendProductInfo = new EventEmitter<Product>();

  constructor( private cart:CartService, private toast: ToastService, private router: Router, private product: ProductService, public auth: AuthService) {}

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

  handleSendProduct(){
    this.sendProductInfo.emit(this.productInfo);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
