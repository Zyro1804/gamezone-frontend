import { Component, effect, input, output } from '@angular/core';
import { Categoria } from '../../../core/services/categorias';
import { FormsModule } from '@angular/forms';
import { DialogModule } from '@openng/optimus-ui/dialog';

export interface CategoriaFormData {
  nombre: string;
  descripcion: string;
}

@Component({
  imports: [FormsModule, DialogModule],
  selector: 'app-categoria-form-modal',
  styleUrl: './categoria-form-modal.css',
  templateUrl: './categoria-form-modal.html',
})

export class CategoriaFormModal {
  visible = input(false);
  categoria = input<Categoria | null>(null);
  cargando = input(false);

  visibleChange = output<boolean>();
  guardar = output<CategoriaFormData>();

  formulario: CategoriaFormData = {
    nombre: '',
    descripcion: ''
  };

  constructor() {
    effect(() => {
      const visible = this.visible();
      const categoria = this.categoria();

      if (visible) {
        this.formulario = {
          nombre: categoria?.nombre ?? '',
          descripcion: categoria?.descripcion ?? ''
        };
      }
    });
  }

  cerrar() {
    if (this.cargando()) return;
    this.visibleChange.emit(false);
  }

  guardarCategoria() {
    if (!this.formulario.nombre.trim()) return;

    this.guardar.emit({
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion.trim()
    });
  }
}