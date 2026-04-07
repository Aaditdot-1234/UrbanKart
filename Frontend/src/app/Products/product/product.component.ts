import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../product.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  products!: Product[];

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.productService.getAllProducts().pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (res) => {
        console.log(res.products)
        this.products = res.products;
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
