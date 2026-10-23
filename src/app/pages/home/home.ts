import { Component } from '@angular/core';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Videojuego, VideojuegoCard } from '../../shared/components/videojuego-card/videojuego-card';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  imports: [Navbar, VideojuegoCard, Footer],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {

  videojuegos: Videojuego[] = [
    {
      id: 1,
      nombre: 'Cyberpunk 2077',
      descripcion: 'Explora Night City en una aventura de mundo abierto.',
      precio: 599,
      categoria: 'RPG',
      imagenUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
      destacado: true
    },
    {
      id: 2,
      nombre: 'Red Dead Redemption 2',
      descripcion: 'Vive una aventura épica en el viejo oeste.',
      precio: 899,
      categoria: 'Acción y aventura',
      imagenUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
      destacado: true
    },
    {
      id: 3,
      nombre: 'Hollow Knight',
      descripcion: 'Descubre un mundo subterráneo lleno de desafíos.',
      precio: 249,
      categoria: 'Plataformas',
      imagenUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg',
      destacado: false
    },
    {
      id: 4,
      nombre: 'Stardew Valley',
      descripcion: 'Construye tu granja y disfruta de una vida tranquila.',
      precio: 179,
      categoria: 'Simulación',
      imagenUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
      destacado: false
    }
  ];
}