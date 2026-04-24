import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public authService = inject(AuthService);
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

  logout() {
    this.authService.logout();
    this.closeMenu();
  }
}
