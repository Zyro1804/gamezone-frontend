import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Categoria {
  id: string;
  nombre: string;
}

@Service()
export class Categorias {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categorias`;

  obtenerCategorias(): Observable<unknown> {
    return this.http.get<unknown>(this.apiUrl);
  }
}