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
import { PasswordModule } from '@openng/optimus-ui/password';

@Component({
  imports: [DialogModule, ButtonModule, FormsModule, ToastModule,PasswordModule],
  selector: 'app-login-modal',
  styleUrl: './login-modal.css',
  templateUrl: './login-modal.html',
})
export class LoginModal {
  visible = input(false);
  visibleChange = output<boolean>();

  cargando = signal(false);
  modoRegistro = signal(false);

  private readonly loginService = inject(Auth);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  correo = '';
  password = '';

  nombreRegistro = '';
  correoRegistro = '';
  passwordRegistro = '';
  confirmarPassword = '';

  cerrarModal(): void {
    this.visibleChange.emit(false);
    this.modoRegistro.set(false);
  }

  cambiarModo(registro: boolean): void {
    if (this.cargando()) return;

    this.modoRegistro.set(registro);
  }

  async iniciarSesion(): Promise<void> {
    if (this.cargando()) return;

    const payload = {
      email: this.correo.trim().toLowerCase(),
      password: this.password,
    };

    this.cargando.set(true);

    try {
      const resp = await firstValueFrom(
        this.loginService.login(payload)
      );

      const rol = resp.usuario.rol;

      this.cerrarModal();

      this.correo = '';
      this.password = '';

      if (rol === 'ADMIN') {
        await this.router.navigate(['/admin/videojuegos']);
      } else if (rol === 'USER') {
        await this.router.navigate(['/gamezone']);
      }

    } catch (err: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al iniciar sesión',
        detail: err.error?.message ||
          'No se pudo iniciar sesión. Inténtalo nuevamente.',
        life: 4000,
      });

    } finally {
      this.cargando.set(false);
    }
  }

  async registrarUsuario(): Promise<void> {
    if (this.cargando()) return;

    const nombre = this.nombreRegistro.trim();
    const email = this.correoRegistro.trim().toLowerCase();
    const password = this.passwordRegistro;

    if (!nombre || !email || !password || !this.confirmarPassword) {
      this.mostrarAdvertencia('Completa todos los campos.');
      return;
    }

    if (nombre.length > 100 || email.length > 150) {
      this.mostrarAdvertencia('El nombre o correo supera la longitud permitida.');
      return;
    }

    if (password.length < 8 || password.length > 72) {
      this.mostrarAdvertencia(
        'La contraseña debe tener entre 8 y 72 caracteres.'
      );
      return;
    }

    if (password !== this.confirmarPassword) {
      this.mostrarAdvertencia('Las contraseñas no coinciden.');
      return;
    }

    this.cargando.set(true);

    try {
      await firstValueFrom(
        this.loginService.registrarUsuario({
          nombre,
          email,
          password
        })
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: 'Tu cuenta fue creada. Ahora puedes iniciar sesión.',
        life: 4000
      });

      this.correo = email;
      this.password = '';

      this.nombreRegistro = '';
      this.correoRegistro = '';
      this.passwordRegistro = '';
      this.confirmarPassword = '';

      this.modoRegistro.set(false);

    } catch (err: any) {
      const mensaje = Array.isArray(err.error?.message)
        ? err.error.message.join(', ')
        : err.error?.message;

      this.messageService.add({
        severity: 'error',
        summary: 'Error al registrar usuario',
        detail: err.status === 409
          ? 'Este correo electrónico ya está registrado.'
          : mensaje || 'No se pudo crear la cuenta.',
        life: 4000
      });

    } finally {
      this.cargando.set(false);
    }
  }

  private mostrarAdvertencia(mensaje: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Verifica los datos',
      detail: mensaje,
      life: 3500
    });
  }
}