import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { filter } from 'rxjs';
import { AdminPublicarComponent } from './pages/admin-publicar/admin-publicar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, FooterComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly title = signal('alfonso-ugarte-ullulluco');
  private router = inject(Router);
  mostrarSidebar = true;

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // CAMBIO: Usar urlAfterRedirects para evitar errores de navegación
        const urlFinal = event.urlAfterRedirects;

        // Lista de páginas que ocupan TODO el ancho (sin sidebar)
        const rutasFullWidth = ['/', '/home', '/autoridades', '/ubicacion','/publicar-ullulluco'];

        // Si la ruta final está en la lista, ocultamos sidebar
        this.mostrarSidebar = !rutasFullWidth.includes(urlFinal);
      });
  }
}
