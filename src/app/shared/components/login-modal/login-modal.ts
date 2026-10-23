import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { email } from '@angular/forms/signals';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageService } from '@openng/optimus-ui/api';
import { Router } from '@angular/router';

@Component({
  imports: [DialogModule, ButtonModule, FormsModule, ToastModule],
  selector: 'app-login-modal',
  styleUrl: './login-modal.css',
  templateUrl: './login-modal.html',
})
export class LoginModal {
  visible = input(false);
  visibleChange = output<boolean>();
  cargando = signal(false);
  private readonly loginService = inject(Auth);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  correo = '';
  password = '';

  cerrarModal() {
    this.visibleChange.emit(false);
  }

  async iniciarSesion() {
    if (this.cargando()) return;
    const payload = {
      email: this.correo,
      password: this.password,
    };
    this.cargando.set(true);
    try {
      const resp = await firstValueFrom(this.loginService.login(payload));
      const rol = resp.usuario.rol;

      this.cerrarModal();

      this.correo = '';
      this.password = '';

      if (rol === 'ADMIN') {
        console.log('entra a admin')
        await this.router.navigate(['/admin/videojuegos']);
      } else if (rol === 'USER') {
        await this.router.navigate(['/gamezone']);
      }
    } catch (err: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al iniciar sesión',
        detail: err.error?.message || 'No se pudo iniciar sesión. Inténtalo nuevamente.',
        life: 4000,
      });
    } finally {
      this.cargando.set(false)
    }
  }
}
