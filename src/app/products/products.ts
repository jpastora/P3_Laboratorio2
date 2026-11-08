import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../services/product';
import { AuthService } from '../services/auth';
import { Product } from '../interfaces/product';
import { ApiError } from '../interfaces/api-error';

@Component({
  imports: [RouterLink],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products {

  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly authService = inject(AuthService);

  products = signal<Product[]>([]);
  errorMessage = signal('');

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.products.set(data),
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set((error.error as ApiError)?.message ?? 'No se pudieron cargar los productos')
      });
  }

  deleteProduct(product: Product) {
    if (!confirm(`¿Desea eliminar el producto "${product.name}"?`)) {
      return;
    }
    this.errorMessage.set('');
    this.productService.delete(product.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.products.update(list => list.filter(p => p.id !== product.id)),
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set((error.error as ApiError)?.message ?? 'No se pudo eliminar el producto')
      });
  }
}