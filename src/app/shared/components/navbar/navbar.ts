import { Component, signal } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { LoginModal } from '../login-modal/login-modal';

@Component({
  imports: [RouterLinkActive, LoginModal],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  mostrarLogin = signal(false);

  abrirLogin() {
    console.log('esta abriendo')
    this.mostrarLogin.set(true);
  }
}