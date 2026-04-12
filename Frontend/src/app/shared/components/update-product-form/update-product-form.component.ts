import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../Products/product.service';
import { CategoriesService } from '../../services/categories.service';
import { SubCategories } from '../../../models/category';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-update-product-form',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './update-product-form.component.html',
  styleUrl: './update-product-form.component.css'
})
export class UpdateProductFormComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Output() updated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  subCategories: SubCategories[] = [];
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  replaceImages = false;
  loading = false;
  error = '';

  private readonly imagesBaseUrl = 'http://localhost:3000/images/';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      product_name: [this.product.product_name, [Validators.required, Validators.maxLength(150)]],
      product_description: [this.product.product_description, Validators.required],
      product_price: [this.product.product_price, [Validators.required, Validators.min(0)]],
      stock: [this.product.stock, [Validators.required, Validators.min(0)]],
      subCategoryId: [null],
    });

    this.categoriesService.getAllSubCategories().subscribe({
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
    if (this.replaceImages && this.selectedFiles.length === 0) {
      this.error = 'Please select at least one replacement image.';
      return;
    }

    this.loading = true;
    this.error = '';

    const buildPayload = (imagePaths?: string[]) => {
      const val = this.form.value;
      const payload: any = {
        product_name: val.product_name,
        product_description: val.product_description,
        product_price: val.product_price,
        stock: val.stock,
      };
      if (val.subCategoryId) payload.subCategoryId = val.subCategoryId;
      if (imagePaths) payload.imageUrls = imagePaths;
      return payload;
    };

    const sendUpdate = (imagePaths?: string[]) => {
      this.productService.updateProduct(this.product.product_id, buildPayload(imagePaths)).subscribe({
        next: () => {
          this.loading = false;
          this.updated.emit();
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message ?? 'Failed to update product.';
        }
      });
    };

    if (this.replaceImages && this.selectedFiles.length > 0) {
      this.productService.uploadImages(this.selectedFiles).subscribe({
        next: (uploadRes) => sendUpdate(uploadRes.imagePaths),
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message ?? 'Failed to upload images.';
        }
      });
    } else {
      sendUpdate();
    }
  }
}
