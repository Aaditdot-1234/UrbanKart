import { Component, OnDestroy, OnInit } from '@angular/core';
import { Categories } from '../../models/category';
import { CategoriesService } from '../../shared/services/categories.service';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from "@angular/router";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-categories',
  imports: [RouterLink, FooterComponent, PaginationComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentPage:number = 1;
  pageSize: number = 12;
  Categories!: Categories[];
  totalPages: number[] = [];
  totalItems:number = 0
  
  constructor(private categoryService: CategoriesService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(page: number = this.currentPage) {
    this.categoryService.getAllCategories(page, this.pageSize).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (res) => {
        this.Categories = res.categories;
        this.currentPage = res.meta.currentPage;
        this.totalItems = res.meta.totalItems;

        // for (let i = 0; i < res.meta.totalPages; i++) {
        //   this.totalPages.push(i);
        // }

        this.totalPages = Array.from(
          {length: res.meta.totalPages},
          (_, i) => i+1
        );
      },
      error: (err) => {
        console.error(err);
      }
    })

  }

  handlePageChange(page: number) {
    if(page !== this.currentPage){
      this.fetchData(page);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
