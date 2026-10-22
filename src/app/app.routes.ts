import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Videojuegos } from './core/services/videojuegos';
import { Categorias } from './core/services/categorias';
import { Navbar } from './shared/components/navbar/navbar';

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