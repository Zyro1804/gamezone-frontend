import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'ADMIN' | 'USER';
}

export interface LoginResponse {
    message: string;
    access_token: string;
    token_type: string;
    usuario: Usuario;
}

export interface RegistroUsuario {
  nombre: string;
  email: string;
  password: string;
}


@Service()
export class Auth {

    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/auth`;
    usuarioActual = signal<Usuario | null>(
        this.obtenerUsuarioGuardado()
    );



    login(credenciales: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${this.baseUrl}/login`,
            credenciales
        ).pipe(
            tap((respuesta) => {
                localStorage.setItem('access_token', respuesta.access_token);
                localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
                this.usuarioActual.set(respuesta.usuario);
            })
        );
    }

     obtenerToken(): string | null {
    return localStorage.getItem('access_token');
  }

  obtenerRol(): 'ADMIN' | 'USER' | null {
    return this.usuarioActual()?.rol ?? null;
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  private obtenerUsuarioGuardado(): Usuario | null {
    const usuario = localStorage.getItem('usuario');

    if (!usuario) return null;

    try {
      return JSON.parse(usuario) as Usuario;
    } catch {
      return null;
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('usuario');
    this.usuarioActual.set(null);
  }

  registrarUsuario(datos: {
    nombre: string;
    email: string;
    password: string;
  }) {
    return this.http.post(
      `${this.baseUrl}/register`,
      datos
    );
  }

}
