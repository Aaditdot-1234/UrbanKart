import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SubCategories, Types } from '../../models/category';
import { Product } from '../../models/product';
import { ProductService } from '../../Products/product.service';
import { CategoriesService } from '../../shared/services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { ToggleVisibilityDirective } from '../../shared/Directives/toggle-visibility.directive';
import { CreateProductFormComponent } from '../../shared/components/create-product-form/create-product-form.component';


@Component({
  selector: 'app-adminproducts',
  imports: [FooterComponent, PaginationComponent, ProductCardComponent, FormsModule, ToggleVisibilityDirective, CreateProductFormComponent],
  templateUrl: './adminproducts.component.html',
  styleUrl: './adminproducts.component.css'
})
export class AdminproductsComponent {
private destroy$ = new Subject<void>();
  isVisible: boolean = false;

  subCategories: SubCategories[] = [];
  types: Types[] = [];

  searchQuery: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;
  selectedTypeIds: number[] = [];
  selectedSubCategoryIds: number[] = [];
  selectedCategoryIds: number[] = [];

  products: Product[] = [];
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number[] = [];
  totalItems: number = 0;

  constructor(
    private productService: ProductService,
    private category: CategoriesService,
    private route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public product: ProductService,
    private toast: ToastService,
  ) { }

  ngOnInit(): void {
    this.fetchAllSubCategories();
    this.fetchAllTypes();

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const rawId = params['categoryId'];
      if (rawId) {
        this.selectedCategoryIds = [Number(rawId)];
        this.applyFilters(1);
      } else {
        this.selectedCategoryIds = [];
        this.fetchData(1);
      }
    });
  }

  fetchAllSubCategories() {
    this.category.getAllSubCategories(1, 1000).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => this.subCategories = res.subCategories,
      error: (err) => console.error(err)
    });
  }

  fetchAllTypes() {
    this.category.getAllTypes().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => this.types = res.types,
      error: (err) => console.error(err)
    });
  }

  fetchData(page: number = this.currentPage) {
    this.productService.getAllProducts(page, this.pageSize).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.products = res.products;
        this.currentPage = res.meta.currentPage;
        this.totalItems = res.meta.totalItems;
        this.totalPages = Array.from({ length: res.meta.totalPages }, (_, i) => i + 1);
      },
      error: (err) => console.error(err)
    });
  }

  applyFilters(page: number = this.currentPage) {
    this.category.filterProducts(
      page,
      this.pageSize,
      this.searchQuery || undefined,
      this.minPrice || undefined,
      this.maxPrice || undefined,
      this.selectedTypeIds.length ? this.selectedTypeIds : undefined,
      this.selectedCategoryIds.length ? this.selectedCategoryIds : undefined,
      this.selectedSubCategoryIds.length ? this.selectedSubCategoryIds : undefined
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.products = res.products;
        this.currentPage = res.meta.currentPage;
        this.totalItems = res.meta.totalItems;
        this.totalPages = Array.from({ length: res.meta.totalPages }, (_, i) => i + 1);
      },
      error: (err) => console.error(err)
    });
  }

  onSearchChange() {
    this.applyFilters(1);
  }

  onPriceChange() {
    this.applyFilters(1);
  }

  onTypeToggle(typeId: number, checked: boolean) {
    if (checked) {
      this.selectedTypeIds = [...this.selectedTypeIds, typeId];
    } else {
      this.selectedTypeIds = this.selectedTypeIds.filter(id => id !== typeId);
    }
    this.applyFilters(1);
  }

  onSubCategoryToggle(subCategoryId: number, checked: boolean) {
    if (checked) {
      this.selectedSubCategoryIds = [...this.selectedSubCategoryIds, subCategoryId];
    } else {
      this.selectedSubCategoryIds = this.selectedSubCategoryIds.filter(id => id !== subCategoryId);
    }
    this.applyFilters(1);
  }

  isTypeSelected(typeId: number): boolean {
    return this.selectedTypeIds.includes(typeId);
  }

  isSubCategorySelected(subCategoryId: number): boolean {
    return this.selectedSubCategoryIds.includes(subCategoryId);
  }

  clearFilters() {
    this.searchQuery = '';
    this.minPrice = 0;
    this.maxPrice = 0;
    this.selectedTypeIds = [];
    this.selectedSubCategoryIds = [];
    this.selectedCategoryIds = [];
    this.router.navigate([], { queryParams: {} });
    this.fetchData(1);
  }

  handlePageChange(page: number) {
    if (page === this.currentPage) return;
    if (this.isFiltering) {
      this.applyFilters(page);
    } else {
      this.fetchData(page);
    }
  }

  get isFiltering(): boolean {
    return (
      this.searchQuery !== '' ||
      this.minPrice !== 0 ||
      this.maxPrice !== 0 ||
      this.selectedTypeIds.length > 0 ||
      this.selectedSubCategoryIds.length > 0 ||
      this.selectedCategoryIds.length > 0
    );
  }

  toggleVisibility(){
    this.isVisible = !this.isVisible;
  }

  toggleNewProduct(product: Product){
    this.products.push()
    this.isVisible = !this.isVisible;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDelete(productInfo: Product){
    this.product.deleteProduct(productInfo.product_id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        if(this.isFiltering){
          this.applyFilters(this.currentPage);
        }
        else{
          this.fetchData(this.currentPage);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
