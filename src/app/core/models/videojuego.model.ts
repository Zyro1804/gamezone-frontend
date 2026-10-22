export interface Videojuego {
  id: string;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  precio: number;
  plataforma?: string;
  categoriaId?: string;
  totalJugadores?: number;
  totalVentas?: number;
  destacado?: boolean;
}