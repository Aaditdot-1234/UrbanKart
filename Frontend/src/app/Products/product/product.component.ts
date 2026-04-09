import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../product.service';
import { Subject, takeUntil } from 'rxjs';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product',
  imports: [FooterComponent, PaginationComponent, ProductCardComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  products!: Product[];
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number[] = [];
  totalItems: number = 0;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(page: number = this.currentPage){
    this.productService.getAllProducts(page, this.pageSize).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (res) => {
        this.products = res.products;
        this.currentPage = res.meta.currentPage;
        this.totalItems = res.meta.totalItems;

        this.totalPages = Array.from(
          {length: res.meta.totalPages},
          (_, i) => i + 1
        )
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  handlePageChange(page: number){
    if(page !== this.currentPage){
      this.fetchData(page);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
