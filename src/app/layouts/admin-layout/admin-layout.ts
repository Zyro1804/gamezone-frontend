import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.css',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  usuario = this.authService.usuarioActual;

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/gamezone']);
  }
}