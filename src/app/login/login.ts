import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { AuthService } from '../services/auth';
import { LoginRequest } from '../interfaces/auth';
import { ApiError } from '../interfaces/api-error';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  loginModel = signal<LoginRequest>({ username: '', password: '' });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.username, { message: 'El usuario es obligatorio' });
    required(fieldPath.password, { message: 'La contraseña es obligatoria' });
  });

  errorMessage = signal('');

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async () => {
      this.errorMessage.set('');
      this.authService
        .login(this.loginModel())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.authService.saveToken(response.access_token);
            this.router.navigate(['/products']);
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessage.set(
              (error.error as ApiError)?.message ?? 'No se pudo iniciar sesión',
            );
          },
        });
    });
  }
}
