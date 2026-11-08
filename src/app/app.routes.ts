import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, title: 'Iniciar sesión' },
  { path: 'register', component: Register, title: 'Registro' },
  { path: '**', redirectTo: 'login' }
];