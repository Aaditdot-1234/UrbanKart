import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { Reviews } from '../../models/reviews';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Products/product.service';
import { ToastService } from '../../shared/services/toast.service';
import { CartService } from '../../shared/services/cart.service';
import { CategoriesService } from '../../shared/services/categories.service';
import { ReviewService } from '../../shared/services/review.service';
import { AuthService } from '../../Auth/auth.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ReviewCardComponent } from '../../shared/components/review-card/review-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { UpdateProductFormComponent } from '../../shared/components/update-product-form/update-product-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products-detail',
  imports: [FooterComponent, ProductCardComponent, ReviewCardComponent, PaginationComponent, UpdateProductFormComponent, FormsModule],
  templateUrl: './admin-products-detail.component.html',
  styleUrl: './admin-products-detail.component.css'
})
export class AdminProductsDetailComponent {
  private destroy$ = new Subject<void>();
  productId !: string | null;
  productInfo!: Product;
  category_name: string = '';
  subcategory_name: string = '';
  type_name: string = '';
  reviews!: Omit<Reviews, 'product'>[];
  similarProducts: Product[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number[] = [];
  totalItems: number = 0;

  isVisible: boolean = false;
  addReview: boolean = false;

  comments!: string;
  rating!: number;
  quantity: number = 1;

  constructor(private route: ActivatedRoute, private product: ProductService, private toast: ToastService, private cart: CartService, private category: CategoriesService, private review: ReviewService, public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    console.log(this.productId);
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
          this.getSimilarProducts(sub.subcategory_id);
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

  getSimilarProducts(subCategory_id: number){
    console.log([subCategory_id]);
    this.category.filterProducts(1,4, undefined, undefined, undefined, undefined, undefined, [subCategory_id]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        console.log(res.message);
        this.similarProducts = res.products;
      }, 
      error: (err) => {
        console.error(err);
      }
    })
  }

  validateRating(event: any) {
    let value = event.target.value;

    if (value > 5) {
      this.rating = 5;
    } else if (value < 1 && value !== null && value !== '') {
      this.rating = 1;
    }
  }

  handlePageChange(page: number) {
    if (page === this.currentPage) return;
    this.fetchReviews(+this.productId!, page);
  }

  toggleUpdateForm() {
    this.isVisible = !this.isVisible
  }

  toggleUpdateData() {
    if(this.productId){
      this.fetchBookData(+this.productId);
    }
    this.isVisible = !this.isVisible
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
