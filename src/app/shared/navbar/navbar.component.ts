import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  // Variable para controlar el estado del menú en móviles
  isMenuOpen = false;
  activeDropdown: string | null = null; // Controla qué submenú está abierto en móvil

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) this.activeDropdown = null;
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.activeDropdown = null;
  }

  toggleDropdown(menu: string, event: Event) {
    // Solo aplicamos lógica de clic si estamos en pantalla móvil
    if (window.innerWidth <= 768) {
      event.preventDefault();
      event.stopPropagation();
      this.activeDropdown = this.activeDropdown === menu ? null : menu;
    }
  }
}
