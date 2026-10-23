import { Component, inject, signal } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { LoginModal } from '../login-modal/login-modal';
import { Auth } from '../../../core/services/auth';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
  imports: [RouterLinkActive, LoginModal,ButtonModule],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  mostrarLogin = signal(false);
  readonly authService = inject(Auth);
  private readonly router = inject(Router);

  abrirLogin() {
    this.mostrarLogin.set(true);
  }
  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/gamezone']);
  }
  irASeccion(id: string): void {
    const seccion = document.getElementById(id);

    if (seccion) {
      seccion.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}