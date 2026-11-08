import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, maxLength, min, required, submit } from '@angular/forms/signals';
import { ProductService } from '../services/product';
import { CategoryService } from '../services/category';
import { Category } from '../interfaces/category';
import { ProductRequest } from '../interfaces/product';
import { ApiError } from '../interfaces/api-error';

interface ProductFormModel {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
}

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-product-form',
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
})
export class ProductForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  productId: number | null = null;
  isEdit = signal(false);
  errorMessage = signal('');

  categories = signal<Category[]>([]);

  productModel = signal<ProductFormModel>({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    categoryId: '',
  });

  productForm = form(this.productModel, (fieldPath) => {
    required(fieldPath.name, { message: 'El nombre del producto es obligatorio' });
    maxLength(fieldPath.name, 255, { message: 'Máximo 255 caracteres' });
    maxLength(fieldPath.description, 255, { message: 'Máximo 255 caracteres' });
    required(fieldPath.price, { message: 'El precio es obligatorio' });
    min(fieldPath.price, 0, { message: 'El precio no puede ser negativo' });
    required(fieldPath.stockQuantity, { message: 'La cantidad en stock es obligatoria' });
    min(fieldPath.stockQuantity, 0, { message: 'El stock no puede ser negativo' });
    required(fieldPath.categoryId, { message: 'Seleccione una categoría' });
  });

  constructor() {
    this.categoryService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.categories.set(data),
        error: () => this.errorMessage.set('No se pudieron cargar las categorías'),
      });

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.productId = Number(id);
      this.isEdit.set(true);

      this.productService
        .getById(this.productId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (product) =>
            this.productModel.set({
              name: product.name,
              description: product.description ?? '',
              price: product.price,
              stockQuantity: product.stockQuantity,
              categoryId: String(product.category.id),
            }),
          error: (error: HttpErrorResponse) =>
            this.errorMessage.set(
              (error.error as ApiError)?.message ?? 'No se encontró el producto',
            ),
        });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.productForm, async () => {
      this.errorMessage.set('');
      const model = this.productModel();

      const data: ProductRequest = {
        name: model.name,
        description: model.description,
        price: Number(model.price),
        stockQuantity: Number(model.stockQuantity),
        categoryId: Number(model.categoryId),
      };

      const request = this.productId
        ? this.productService.update(this.productId, data)
        : this.productService.create(data);

      request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set(
            (error.error as ApiError)?.message ?? 'No se pudo guardar el producto',
          ),
      });
    });
  }
}
