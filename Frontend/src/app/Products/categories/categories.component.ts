import { Component, OnDestroy, OnInit } from '@angular/core';
import { Categories } from '../../models/category';
import { CategoriesService } from '../../shared/services/categories.service';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from "@angular/router";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { Meta } from '../../models/auth';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, FooterComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>(); 
  Categories!: Categories[];
  meta!: Meta;

  constructor(private categoryService: CategoriesService){}

  ngOnInit(): void {
    this.categoryService.getAllCategories().pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (res) => {
        console.log(res.message);
        console.log(res.categories);
        this.Categories = res.categories;
        this.meta = res.meta;
      }, 
      error: (err) => {
        console.error(err);
      }
    })
    console.log(this.Categories);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
