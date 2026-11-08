import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config';
import { Category, CategoryRequest } from '../interfaces/category';

@Service()
export class CategoryService {

  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/categories`;

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  create(data: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.url, data);
  }

  update(id: number, data: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}