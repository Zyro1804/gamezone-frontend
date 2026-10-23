import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Categoria, categoriasService } from '../../../core/services/categorias';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TableModule } from '@openng/optimus-ui/table';
import { CategoriaFormData, CategoriaFormModal } from '../../../shared/components/categoria-form-modal/categoria-form-modal';
import { ToastModule } from '@openng/optimus-ui/toast';
import { MessageService } from '@openng/optimus-ui/api';
import { DialogModule } from '@openng/optimus-ui/dialog';

@Component({
  imports: [ButtonModule, TableModule, CategoriaFormModal, ToastModule, DialogModule],
  selector: 'app-categorias',
  styleUrl: './categorias.css',
  templateUrl: './categorias.html',
})
export class Categorias implements OnInit {

  private readonly categoriasService = inject(categoriasService);
  private readonly messageService = inject(MessageService);

  categorias = signal<Categoria[]>([]);
  cargando = signal(false);
  errorCarga = signal(false);
  mostrarModal = signal(false);
  categoriaSeleccionada = signal<Categoria | null>(null);
  guardando = signal(false);
  mostrarConfirmacion = signal(false);
  categoriaEliminar = signal<Categoria | null>(null);
  eliminando = signal(false);

  async ngOnInit() {
    await this.obtenerCategorias();
  }

  async obtenerCategorias() {
    this.cargando.set(true);
    this.errorCarga.set(false);

    try {
      const respuesta = await firstValueFrom(
        this.categoriasService.obtenerCategoriasAdmin()
      );

      console.log('Categorías:', respuesta);

      this.categorias.set(respuesta);

    } catch (error) {
      console.error('Error al obtener categorías:', error);
      this.errorCarga.set(true);
      this.categorias.set([]);
    } finally {
      this.cargando.set(false);
    }
  }
  

  async guardarCategoria(datos: CategoriaFormData) {
    if (this.guardando()) return;

    this.guardando.set(true);

    try {
      const categoria = this.categoriaSeleccionada();

      if (categoria) {
        await firstValueFrom(
          this.categoriasService.actualizarCategoria(
            categoria.id,
            datos
          )
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Categoría actualizada',
          detail: 'La categoría se actualizó correctamente.',
          life: 4000
        });

      } else {
        await firstValueFrom(
          this.categoriasService.crearCategoria(datos)
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Categoría creada',
          detail: 'La categoría se registró correctamente.',
          life: 4000
        });
      }

      this.mostrarModal.set(false);
      this.categoriaSeleccionada.set(null);

      await this.obtenerCategorias();

    } catch (err: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al guardar categoría',
        detail: Array.isArray(err.error?.message)
          ? err.error.message.join(', ')
          : err.error?.message || 'No se pudo guardar la categoría.',
        life: 4000
      });

    } finally {
      this.guardando.set(false);
    }
  }



  nuevaCategoria() {
    this.categoriaSeleccionada.set(null);
    this.mostrarModal.set(true);
  }

  editarCategoria(categoria: Categoria) {
    this.categoriaSeleccionada.set(categoria);
    this.mostrarModal.set(true);
  }
  eliminarCategoria(categoria: Categoria) {
    this.categoriaEliminar.set(categoria);
    this.mostrarConfirmacion.set(true);
  }
  
  async confirmarEliminacion() {
    const categoria = this.categoriaEliminar();

    if (!categoria || this.eliminando()) return;

    this.eliminando.set(true);

    try {
      await firstValueFrom(
        this.categoriasService.eliminarCategoria(categoria.id)
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Categoría eliminada',
        detail: `La categoría "${categoria.nombre}" se eliminó correctamente.`,
        life: 4000
      });

      this.mostrarConfirmacion.set(false);
      this.categoriaEliminar.set(null);

      await this.obtenerCategorias();

    } catch (err: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: Array.isArray(err.error?.message)
          ? err.error.message.join(', ')
          : err.error?.message || 'No se pudo eliminar la categoría.',
        life: 4000
      });

    } finally {
      this.eliminando.set(false);
    }
  }

  cancelarEliminacion() {
    if (this.eliminando()) return;

    this.mostrarConfirmacion.set(false);
    this.categoriaEliminar.set(null);
  }

}
