import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TableModule } from '@openng/optimus-ui/table';
import { firstValueFrom } from 'rxjs';
import { videojuegosService } from '../../../core/services/videojuegos';
import { CategoriaOpcion, VideojuegoFormData, VideojuegoFormModal } from '../../../shared/components/videojuego-form-modal/videojuego-form-modal';
import { Categorias } from '../../../core/services/categorias';

@Component({
  imports: [TableModule,ButtonModule, CurrencyPipe, VideojuegoFormModal],
  selector: 'app-videojuegos',
  styleUrl: './videojuegos.css',
  templateUrl: './videojuegos.html',
})
export class Videojuegos implements OnInit {
  private readonly videojuegosService = inject(videojuegosService)
  private readonly categoriasService = inject(Categorias)

  videojuegos = signal<any[]>([]);
  cargando = signal(false);
  mostrarModal = signal(false);
  guardando = signal(false);
  categorias = signal<CategoriaOpcion[]>([]);

  async ngOnInit() {
    await Promise.all([
      this.obtenerVideojuegos(),
      this.obtenerCategorias()
    ]);
  }
  abrirModal() {
  this.mostrarModal.set(true);
  }

async guardarVideojuego(datos: VideojuegoFormData) {
  this.guardando.set(true);

  try {
    const formData = new FormData();

    formData.append('nombre', datos.nombre.trim());
    formData.append('descripcion', datos.descripcion);
    formData.append('precio', String(datos.precio));
    formData.append('categoriaId', datos.categoriaId!);
    formData.append('plataforma', datos.plataforma);
    formData.append('totalJugadores', String(datos.totalJugadores));
    formData.append('totalVentas', String(datos.totalVentas));
    formData.append('destacado', String(datos.destacado));

    if (datos.imagen) {
      formData.append('imagen', datos.imagen);
    }

    const respuesta = await firstValueFrom(
      this.videojuegosService.crearVideojuego(formData)
    );

    console.log('Videojuego creado:', respuesta);

    this.mostrarModal.set(false);
    await this.obtenerVideojuegos();

  } catch (error) {
    console.error('Error al registrar videojuego:', error);
  } finally {
    this.guardando.set(false);
  }
}

  async obtenerVideojuegos() {
    this.cargando.set(true);

    try {
      const resp = await firstValueFrom(
        this.videojuegosService.obtenerVideojuegos(1, 10)
      );

      console.log('Respuesta de videojuegos:', resp);

      if (Array.isArray(resp)) {
        this.videojuegos.set(resp);
      } else {
        const resultado = resp as any;
        this.videojuegos.set(resultado.data ?? []);
      }

    } catch (error) {
      console.error('Error al obtener videojuegos:', error);
      this.videojuegos.set([]);
    } finally {
      this.cargando.set(false);
    }
  }

  async obtenerCategorias() {
  try {
    const respuesta = await firstValueFrom(
      this.categoriasService.obtenerCategorias()
    );

    console.log('Respuesta de categorías:', respuesta);

    if (Array.isArray(respuesta)) {
      this.categorias.set(respuesta);
    } else {
      const resultado = respuesta as any;
      this.categorias.set(resultado.data ?? []);
    }

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    this.categorias.set([]);
  }
}
}

