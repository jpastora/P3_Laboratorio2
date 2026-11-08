import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { CategoryService } from '../services/category';
import { CategoryRequest } from '../interfaces/category';
import { ApiError } from '../interfaces/api-error';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-category-form',
  styleUrl: './category-form.css',
  templateUrl: './category-form.html',
})
export class CategoryForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  categoryId: number | null = null;
  isEdit = signal(false);
  errorMessage = signal('');

  categoryModel = signal<CategoryRequest>({ name: '', description: '' });

  categoryForm = form(this.categoryModel, (fieldPath) => {
    required(fieldPath.name, { message: 'El nombre de la categoría es obligatorio' });
    maxLength(fieldPath.name, 255, { message: 'Máximo 255 caracteres' });
    maxLength(fieldPath.description, 255, { message: 'Máximo 255 caracteres' });
  });

  constructor() {
    const id = this.route.snapshot.params['id'];

    if (id) {
      this.categoryId = Number(id);
      this.isEdit.set(true);

      this.categoryService
        .getById(this.categoryId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (category) =>
            this.categoryModel.set({
              name: category.name,
              description: category.description ?? '',
            }),
          error: (error: HttpErrorResponse) =>
            this.errorMessage.set(
              (error.error as ApiError)?.message ?? 'No se encontró la categoría',
            ),
        });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.categoryForm, async () => {
      this.errorMessage.set('');
      const data = this.categoryModel();

      const request = this.categoryId
        ? this.categoryService.update(this.categoryId, data)
        : this.categoryService.create(data);

      request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/categories']),
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set(
            (error.error as ApiError)?.message ?? 'No se pudo guardar la categoría',
          ),
      });
    });
  }
}
