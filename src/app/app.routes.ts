import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Products } from './products/products';
import { Categories } from './categories/categories';
import { Users } from './users/users';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { guestGuard } from './guards/guest-guard';
import { CategoryForm } from './category-form/category-form';
import { ProductForm } from './product-form/product-form';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  { path: 'login', component: Login, title: 'Iniciar sesión', canActivate: [guestGuard] },
  { path: 'register', component: Register, title: 'Registro', canActivate: [guestGuard] },

  { path: 'products', component: Products, title: 'Productos', canActivate: [authGuard] },

{
  path: 'products/new',
  component: ProductForm,
  title: 'Nuevo producto',
  canActivate: [authGuard, roleGuard],
  data: { role: 'SUPER-ADMIN-ROLE' }
},
{
  path: 'products/:id/edit',
  component: ProductForm,
  title: 'Editar producto',
  canActivate: [authGuard, roleGuard],
  data: { role: 'SUPER-ADMIN-ROLE' }
},
  
  { path: 'categories', component: Categories, title: 'Categorías', canActivate: [authGuard] },

{
  path: 'categories/new',
  component: CategoryForm,
  title: 'Nueva categoría',
  canActivate: [authGuard, roleGuard],
  data: { role: 'SUPER-ADMIN-ROLE' }
},
{
  path: 'categories/:id/edit',
  component: CategoryForm,
  title: 'Editar categoría',
  canActivate: [authGuard, roleGuard],
  data: { role: 'SUPER-ADMIN-ROLE' }
},

  {
    path: 'users',
    component: Users,
    title: 'Usuarios',
    canActivate: [authGuard, roleGuard],
    data: { role: 'SUPER-ADMIN-ROLE' }
  },

  { path: '**', redirectTo: 'products' }
  
];