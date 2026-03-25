import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavbarComponent,SidebarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = signal('alfonso-ugarte-ullulluco');
  private router = inject(Router);
  mostrarSidebar = true;

  constructor() {
    // Escuchamos los cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la URL es la raíz '/' o está vacía, ocultamos el sidebar
      this.mostrarSidebar = event.url !== '/' && event.url !== '/home';
    });
  }
}
