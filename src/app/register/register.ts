import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { AuthService } from '../services/auth';
import { RegisterRequest } from '../interfaces/auth';
import { ApiError } from '../interfaces/api-error';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  registerModel = signal<RegisterRequest>({
    username: '', email: '', firstName: '', lastName: '', password: ''
  });

  registerForm = form(this.registerModel, (fieldPath) => {
    required(fieldPath.username, { message: 'El usuario es obligatorio' });
    required(fieldPath.email, { message: 'El correo es obligatorio' });
    email(fieldPath.email, { message: 'Ingrese un correo válido' });
    required(fieldPath.firstName, { message: 'El nombre es obligatorio' });
    required(fieldPath.lastName, { message: 'El apellido es obligatorio' });
    required(fieldPath.password, { message: 'La contraseña es obligatoria' });
    minLength(fieldPath.password, 8, { message: 'La contraseña debe tener al menos 8 caracteres' });
  });

  errorMessage = signal('');

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.registerForm, async () => {
      this.errorMessage.set('');
      this.authService.register(this.registerModel())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (user) => {
            alert(`Usuario ${user.username} registrado. Ya puede iniciar sesión.`);
            this.router.navigate(['/login']);
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessage.set((error.error as ApiError)?.message ?? 'No se pudo registrar el usuario');
          }
        });
    });
  }
}