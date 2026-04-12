import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { DataService, Entrada } from '../../core/services/data.service';
import { Observable, filter, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private dataService = inject(DataService);
  private router = inject(Router);

  recientes$!: Observable<Entrada[]>;
  tituloSidebar: string = 'Lo más reciente';

  ngOnInit(): void {
    this.recientes$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      switchMap(() => {
        const urlSegments = this.router.url.split('/'); 
        // URL Ejemplo 1: /gastronomia -> segments[1] = 'gastronomia'
        // URL Ejemplo 2: /detalle/historia/id -> segments[1] = 'detalle', segments[2] = 'historia'

        let categoria = urlSegments[1] || 'gastronomia';

        // Si la ruta empieza con 'detalle', la categoría REAL es el segundo segmento
        if (categoria === 'detalle' && urlSegments[2]) {
          categoria = urlSegments[2]; 
        }

        this.actualizarTitulo(categoria);
        
        // Ahora pide siempre la categoría correcta al servicio
        return this.dataService.getEntriesBySubcategory(categoria);
      }),
    );
  }

  private actualizarTitulo(cat: string) {
    const nombres: any = {
      gastronomia: 'Últimos Platos',
      festividades: 'Próximas Fiestas',
      historia: 'Relatos Históricos',
      agricultura: 'Cosechas Recientes',
    };
    this.tituloSidebar = nombres[cat] || 'Lo más reciente';
  }
}