import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Videojuego, VideojuegoCard } from '../../shared/components/videojuego-card/videojuego-card';
import { Footer } from '../../shared/components/footer/footer';
import { videojuegosService } from '../../core/services/videojuegos';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria, categoriasService } from '../../core/services/categorias';

@Component({
  imports: [Navbar, VideojuegoCard, Footer],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {

  private readonly videojuegosService = inject(videojuegosService);
  private readonly categoriasService = inject(categoriasService);

  categorias = signal<Categoria[]>([]);
  categoriaSeleccionada = signal<string | null>(null);
  videojuegosMasVendidos = signal<Videojuego[]>([]);
  videojuegos = signal<Videojuego[]>([]);
  cargando = signal(false);
  error = signal(false);
  cargandoInicial = signal(true);

  async ngOnInit(): Promise<void> {
    this.cargandoInicial.set(true);

    try {
      await Promise.all([
        this.cargarVideojuegos(),
        this.cargarCategorias(),
        this.cargarMasVendidos(),
        new Promise<void>(resolve => setTimeout(resolve, 1000))
      ]);
    } finally {
      this.cargandoInicial.set(false);
    }
  }

  async cargarVideojuegos(): Promise<void> {
    this.cargando.set(true);
    this.error.set(false);

    try {
      const respuesta: any = await firstValueFrom(
        this.videojuegosService.obtenerVideojuegos(1, 20)
      );

      const lista = Array.isArray(respuesta)
        ? respuesta
        : respuesta.data ?? [];

      const videojuegosActivos: Videojuego[] = lista
        .filter((juego: any) => juego.activo === true)
        .map((juego: any) => ({
          id: juego.id,
          nombre: juego.nombre,
          descripcion: juego.descripcion ?? '',
          precio: Number(juego.precio),
          categoria: juego.categoria?.nombre ?? 'Sin categoría',
          imagenUrl: this.obtenerUrlImagen(juego.imagenUrl),
          destacado: juego.destacado ?? false
        }));

      this.videojuegos.set(videojuegosActivos);

    } catch (error) {
      console.error('Error al obtener videojuegos:', error);
      this.error.set(true);
    } finally {
      this.cargando.set(false);
    }
  }

  obtenerUrlImagen(imagenUrl?: string): string {
    if (!imagenUrl) return '';

    if (/^https?:\/\//i.test(imagenUrl)) {
      return imagenUrl;
    }

    return `${environment.apiUrl}${imagenUrl}`;
  }

    videojuegosFiltrados = computed(() => {
    const categoriaId = this.categoriaSeleccionada();

    if (!categoriaId) {
      return this.videojuegos();
    }

    const categoria = this.categorias().find(
      item => item.id === categoriaId
    );

    if (!categoria) {
      return [];
    }

    return this.videojuegos().filter(
      juego => juego.categoria === categoria.nombre
    );
  });

  seleccionarCategoria(id: string | null): void {
    this.categoriaSeleccionada.set(id);
  }

  async cargarCategorias(): Promise<void> {
    try {
      const respuesta = await firstValueFrom(
        this.categoriasService.obtenerCategorias()
      );

      this.categorias.set(
        respuesta.filter(categoria => categoria.activo !== false)
      );
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  async cargarMasVendidos(): Promise<void> {
    try {
      const respuesta: any = await firstValueFrom(
        this.videojuegosService.obtenerMasVendidos()
      );

      const lista = Array.isArray(respuesta)
        ? respuesta
        : respuesta.data ?? [];

      this.videojuegosMasVendidos.set(
        lista
          .filter((juego: any) => juego.activo !== false)
          .slice(0, 4)
          .map((juego: any) => ({
            id: juego.id,
            nombre: juego.nombre,
            descripcion: juego.descripcion ?? '',
            precio: Number(juego.precio),
            categoria: juego.categoria?.nombre ?? '',
            imagenUrl: this.obtenerUrlImagen(juego.imagenUrl),
            totalVentas: Number(juego.totalVentas ?? 0)
          }))
      );
    } catch (error) {
      console.error('Error al cargar los más vendidos:', error);
    }
  }

  irASeccion(id: string): void {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}