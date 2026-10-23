import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';

export interface CategoriaOpcion {
  id: string;
  nombre: string;
}

export interface VideojuegoFormData {
  nombre: string;
  descripcion: string;
  precio: number | null;
  categoriaId: string | null;
  plataforma: string;
  totalJugadores: number;
  totalVentas: number;
  destacado: boolean;
  activo: boolean;
  imagen: File | null;
}

@Component({
  selector: 'app-videojuego-form-modal',
  standalone: true,
  imports: [FormsModule, DialogModule, ButtonModule],
  templateUrl: './videojuego-form-modal.html',
  styleUrl: './videojuego-form-modal.css'
})
export class VideojuegoFormModal {
  visible = input(false);
  visibleChange = output<boolean>();
  guardar = output<VideojuegoFormData>();
  cargando = input(false);

  categorias = input<CategoriaOpcion[]>([]);

  plataformas = [
    'PC',
    'PlayStation 4',
    'PlayStation 5',
    'Xbox One',
    'Xbox Series X/S',
    'Nintendo Switch',
    'Nintendo Switch 2',
    'Android',
    'iOS'
  ];

  formulario: VideojuegoFormData = this.formularioInicial();

  private formularioInicial(): VideojuegoFormData {
    return {
      nombre: '',
      descripcion: '',
      precio: null,
      categoriaId: null,
      plataforma: '',
      totalJugadores: 0,
      totalVentas: 0,
      destacado: false,
      activo: true,
      imagen: null
    };
  }

  seleccionarImagen(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formulario.imagen = input.files?.[0] ?? null;
  }

  cerrar() {
    if (this.cargando()) return;

    this.visibleChange.emit(false);
  }

  guardarVideojuego() {
    const datos = this.formulario;

    if (
      !datos.nombre.trim() ||
      datos.precio === null ||
      datos.precio < 0 ||
      !datos.categoriaId ||
      !datos.plataforma ||
      datos.totalJugadores < 0 ||
      datos.totalVentas < 0
    ) {
      return;
    }

    this.guardar.emit({ ...datos });
  }

  limpiarFormulario() {
    this.formulario = this.formularioInicial();
  }
}