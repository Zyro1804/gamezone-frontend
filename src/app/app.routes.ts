import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Navbar } from './shared/components/navbar/navbar';
import { Videojuegos } from './pages/admin/videojuegos/videojuegos';
import { Categorias } from './pages/admin/categorias/categorias';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'gamezone',
    pathMatch: 'full',
  },
  {
    path: 'gamezone',
    component: Home,
  },
   {
    path: 'header',
    component: Navbar,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: '',
        redirectTo: 'videojuegos',
        pathMatch: 'full',
      },
      {
        path: 'videojuegos',
        component: Videojuegos,
      },
      {
        path: 'categorias',
        component: Categorias,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'gamezone',
  },
];