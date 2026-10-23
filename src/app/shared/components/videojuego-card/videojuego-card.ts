import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { CardModule } from '@openng/optimus-ui/card';

export interface Videojuego {
  id: number;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  precio: number;
  categoria?: string;
  destacado?: boolean;
}


@Component({
  imports: [CardModule, CurrencyPipe],
  selector: 'app-videojuego-card',
  styleUrl: './videojuego-card.css',
  templateUrl: './videojuego-card.html',
})
export class VideojuegoCard {
  videojuego = input.required<Videojuego>();
}
