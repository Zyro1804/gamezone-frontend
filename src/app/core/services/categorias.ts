import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface CrearCategoriaDto {
  nombre: string;
  descripcion?: string;
}

export type ActualizarCategoriaDto = Partial<CrearCategoriaDto>;

@Service()
export class categoriasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categorias`;

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  obtenerCategoriasAdmin(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/admin/todas`);
  }

  obtenerCategoria(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  crearCategoria(datos: CrearCategoriaDto): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, datos);
  }

  actualizarCategoria(
    id: string,
    datos: ActualizarCategoriaDto
  ): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, datos);
  }

  eliminarCategoria(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}