import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TableModule } from '@openng/optimus-ui/table';
import { firstValueFrom } from 'rxjs';
import { videojuegosService } from '../../../core/services/videojuegos';
import { CategoriaOpcion, VideojuegoEditar, VideojuegoFormData, VideojuegoFormModal } from '../../../shared/components/videojuego-form-modal/videojuego-form-modal';
import { categoriasService } from '../../../core/services/categorias';
import { MessageService } from '@openng/optimus-ui/api';
import { ToastModule } from '@openng/optimus-ui/toast';
import { environment } from '../../../../environments/environment';
import { DialogModule } from '@openng/optimus-ui/dialog';

@Component({
  imports: [TableModule,ButtonModule, CurrencyPipe, VideojuegoFormModal, ToastModule, DialogModule],
  selector: 'app-videojuegos',
  styleUrl: './videojuegos.css',
  templateUrl: './videojuegos.html',
})
export class Videojuegos implements OnInit {
  private readonly videojuegosService = inject(videojuegosService)
  private readonly categoriasService = inject(categoriasService)
  private readonly messageService = inject(MessageService);
  videojuegoSeleccionado = signal<VideojuegoEditar | null>(null);

  videojuegos = signal<any[]>([]);
  cargando = signal(false);
  mostrarModal = signal(false);
  guardando = signal(false);
  categorias = signal<CategoriaOpcion[]>([]);
  mostrarConfirmacion = signal(false);
  videojuegoEliminar = signal<VideojuegoEditar | null>(null);
  eliminando = signal(false);

  async ngOnInit() {
    await Promise.all([
      this.obtenerVideojuegos(),
      this.obtenerCategorias()
    ]);
  }

 
  async guardarVideojuego(datos: VideojuegoFormData) {
    if (this.guardando()) return;

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

      const videojuego = this.videojuegoSeleccionado();

      if (videojuego) {
        formData.append('activo', String(datos.activo));
        await firstValueFrom(
          this.videojuegosService.actualizarVideojuego(
            videojuego.id,
            formData
          )
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Videojuego actualizado',
          detail: 'Los cambios se guardaron correctamente.',
          life: 4000
        });
      } else {
        await firstValueFrom(
          this.videojuegosService.crearVideojuego(formData)
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Videojuego registrado',
          detail: 'El videojuego se registró correctamente.',
          life: 4000
        });
      }

      this.mostrarModal.set(false);
      this.videojuegoSeleccionado.set(null);

      await this.obtenerVideojuegos();

    } catch (err: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al guardar videojuego',
        detail: Array.isArray(err.error?.message)
          ? err.error.message.join(', ')
          : err.error?.message || 'No se pudo guardar el videojuego.',
        life: 4000
      });
    } finally {
      this.guardando.set(false);
    }
  }


  obtenerUrlImagen(imagenUrl: string): string {
    if (!imagenUrl) return '';

    if (/^https?:\/\//i.test(imagenUrl)) {
      return imagenUrl;
    }
    return `${environment.apiUrl}${imagenUrl}`;
  }

  async obtenerVideojuegos() {
    this.cargando.set(true);

    try {
      const resp = await firstValueFrom(
        this.videojuegosService.obtenerVideojuegosAdmin(1, 10)
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
  
  abrirModal() {
    this.videojuegoSeleccionado.set(null);
    this.mostrarModal.set(true);
  }

  editarVideojuego(videojuego: VideojuegoEditar) {
    this.videojuegoSeleccionado.set(videojuego);
    this.mostrarModal.set(true);
  }

  obtenerImagenActual(): string | null {
    const imagen = this.videojuegoSeleccionado()?.imagenUrl;

    return imagen ? this.obtenerUrlImagen(imagen) : null;
  }
  solicitarEliminacion(videojuego: VideojuegoEditar) {
  this.videojuegoEliminar.set(videojuego);
  this.mostrarConfirmacion.set(true);
}

  cancelarEliminacion() {
    if (this.eliminando()) return;

    this.mostrarConfirmacion.set(false);
    this.videojuegoEliminar.set(null);
  }

  async confirmarEliminacion() {
    const videojuego = this.videojuegoEliminar();

    if (!videojuego || this.eliminando()) return;

    this.eliminando.set(true);

    try {
      await firstValueFrom(
        this.videojuegosService.eliminarVideojuego(videojuego.id)
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Videojuego eliminado',
        detail: `"${videojuego.nombre}" se eliminó correctamente.`,
        life: 4000
      });

      this.mostrarConfirmacion.set(false);
      this.videojuegoEliminar.set(null);

      await this.obtenerVideojuegos();

    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: Array.isArray(error.error?.message)
          ? error.error.message.join(', ')
          : error.error?.message || 'No se pudo eliminar el videojuego.',
        life: 4000
      });
    } finally {
      this.eliminando.set(false);
    }
  }

}

