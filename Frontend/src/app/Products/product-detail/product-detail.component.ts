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
import { ReviewCardComponent } from '../../shared/components/review-card/review-card.component';
import { Reviews } from '../../models/reviews';
import { ReviewService } from '../../shared/services/review.service';
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-product-detail',
  imports: [FooterComponent, ProductCardComponent, ReviewCardComponent, PaginationComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  productId !: string | null;
  productInfo!: Product;
  category_name: string = '';
  subcategory_name: string = '';
  type_name: string = '';
  reviews!: Omit<Reviews, 'product'>[];

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number[] = [];
  totalItems: number = 0;

  constructor(private route: ActivatedRoute, private product: ProductService, private toast: ToastService, private cart: CartService, private category: CategoriesService, private review: ReviewService) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    if (this.productId) {
      this.fetchBookData(+this.productId);
      this.fetchCategoryInfo(+this.productId);
      this.fetchReviews(+this.productId);
    }
  }

  fetchBookData(productId: number) {
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

  fetchCategoryInfo(productId: number) {
    this.category.getCategoriesByProduct(productId).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (res) => {
        if (res?.product?.subCategories) {
          const sub = res.product.subCategories
          this.subcategory_name = sub.subcategory_name;
          this.category_name = sub.categories?.category_name;
          this.type_name = sub.categories?.types?.type_name;
        }
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  fetchReviews(productId: number, page: number = this.currentPage) {
    this.review.getAllReviews(productId, page, this.pageSize).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.reviews = res.reviews;
        this.totalItems = res.meta.totalItems;
        this.totalPages = Array.from({ length: res.meta.totalPages }, (_, i) => i + 1);
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
        this.cart.toggleCardVisibility();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  handlePageChange(page: number) {
    if (page === this.currentPage) return;
    this.fetchReviews(+this.productId!, page);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
