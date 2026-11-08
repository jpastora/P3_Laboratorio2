import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config';
import { User } from '../interfaces/user';

@Service()
export class UserService {

  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/users`;

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }
}