import { Component, DestroyRef, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../services/user';
import { User } from '../interfaces/user';
import { ApiError } from '../interfaces/api-error';
import { UserCard } from '../user-card/user-card';

@Component({
  imports: [UserCard],
  selector: 'app-users',
  styleUrl: './users.css',
  templateUrl: './users.html',
})
export class Users {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  users = signal<User[]>([]);
  errorMessage = signal('');

  constructor() {
    this.userService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.users.set(data),
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set(
            (error.error as ApiError)?.message ?? 'No se pudieron cargar los usuarios',
          ),
      });
  }
}
