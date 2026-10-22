import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {}
