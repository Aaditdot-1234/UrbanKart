import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../Products/product.service';
import { CategoriesService } from '../../services/categories.service';
import { SubCategories } from '../../../models/category';
import { switchMap } from 'rxjs';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-create-product-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-product-form.component.html',
  styleUrl: './create-product-form.component.css'
})
export class CreateProductFormComponent implements OnInit {
  @Output() created = new EventEmitter<Product>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  subCategories: SubCategories[] = [];
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoriesService: CategoriesService
  ) {
    this.form = this.fb.group({
      product_name: ['', [Validators.required, Validators.maxLength(150)]],
      product_description: ['', Validators.required],
      product_price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      subCategoryId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.categoriesService.getAllSubCategories(1, 1000).subscribe({
      next: (res) => this.subCategories = res.subCategories,
      error: () => this.error = 'Failed to load subcategories.'
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.selectedFiles = Array.from(input.files);
    this.previewUrls = [];

    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => this.previewUrls.push(e.target!.result as string);
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.selectedFiles.length === 0) {
      this.error = 'Please select at least one product image.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.productService.uploadImages(this.selectedFiles).pipe(
      switchMap((uploadRes) => {
        const payload = {
          ...this.form.value,
          imageUrls: uploadRes.imagePaths
        };
        return this.productService.createProduct(payload);
      })
    ).subscribe({
      next: (res) => {
        this.loading = false;
        this.created.emit(res.product);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Failed to create product.';
      }
    });
  }
}
