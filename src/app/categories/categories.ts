import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryService } from '../services/category';
import { AuthService } from '../services/auth';
import { Category } from '../interfaces/category';
import { ApiError } from '../interfaces/api-error';

@Component({
  imports: [RouterLink],
  selector: 'app-categories',
  styleUrl: './categories.css',
  templateUrl: './categories.html',
})
export class Categories {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly authService = inject(AuthService);

  categories = signal<Category[]>([]);
  errorMessage = signal('');

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.categories.set(data),
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set(
            (error.error as ApiError)?.message ?? 'No se pudieron cargar las categorías',
          ),
      });
  }

  deleteCategory(category: Category) {
    if (!confirm(`¿Desea eliminar la categoría "${category.name}"?`)) {
      return;
    }
    this.errorMessage.set('');
    this.categoryService
      .delete(category.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        // Se quita de la lista sin volver a consultar al backend
        next: () => this.categories.update((list) => list.filter((c) => c.id !== category.id)),
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set(
            (error.error as ApiError)?.message ?? 'No se pudo eliminar la categoría',
          ),
      });
  }
}
