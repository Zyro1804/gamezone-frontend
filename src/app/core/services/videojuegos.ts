import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Videojuego {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
  activo?: boolean;
  categoria?: string;
}

@Service()
export class videojuegosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/videojuegos`;
  

  obtenerVideojuegos(
    pagina: number = 1,
    limite: number = 10
  ): Observable<unknown> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('limite', limite);

    return this.http.get<unknown>(this.apiUrl, { params });
  }

  
  obtenerVideojuegosAdmin(
    pagina: number = 1,
    limite: number = 10
  ): Observable<unknown> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('limite', limite);

    return this.http.get<unknown>(`${this.apiUrl}/admin`, { params });
  }

  crearVideojuego(datos: FormData): Observable<unknown> {
   return this.http.post<unknown>(this.apiUrl, datos);
  }

  actualizarVideojuego(
    id: string,
    datos: FormData
  ): Observable<unknown> {
    return this.http.put<unknown>(
      `${this.apiUrl}/${id}`,
      datos
    );
  }

  eliminarVideojuego(id: string): Observable<unknown> {
    return this.http.delete<unknown>(
      `${this.apiUrl}/${id}`
    );
  }
}