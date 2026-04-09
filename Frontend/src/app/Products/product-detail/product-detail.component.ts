import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../product.service';
import { ToastService } from '../../shared/services/toast.service';
import { Product } from '../../models/product';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";
import { CartService } from '../../shared/services/cart.service';
import { CategoriesService } from '../../shared/services/categories.service';

@Component({
  selector: 'app-product-detail',
  imports: [FooterComponent, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent  implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  productId !: string | null;
  productInfo!: Product;
  category_name!: string;
  subcategory_name!: string;
  type_name!: string;

  constructor(private route: ActivatedRoute, private product: ProductService, private toast:ToastService, private cart: CartService, private category: CategoriesService){}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    if(this.productId){
      this.fetchBookData(+this.productId);
      this.fetchCategoryInfo(+this.productId);
    }
  }

  fetchBookData(productId: number){
    this.product.getProductById(productId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.productInfo = res;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  fetchCategoryInfo(productId: number){
    this.category.getCategoriesByProduct(productId).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (res) => {
        this.subcategory_name = res.product.subCategories.subcategory_name;
        this.category_name = res.product.subCategories.categories.category_name;
        this.type_name = res.product.subCategories.categories.types.type_name;
      }, 
      error: (err) => {
        console.error(err);
      }
    })
  }

  handleAddToCart() {
    this.cart.addToCart(this.productInfo.product_id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.toast.showToast(200, res.message);
      },
      error: (err) => {
        console.error(err);
      }
    })

    setTimeout(() => {
      this.cart.toggleCardVisibility();
    },1000)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
