import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { DataService, Entrada } from '../../core/services/data.service';
import { Observable, filter, startWith, switchMap, map } from 'rxjs';

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
        const url = this.router.url;
        const segments = url.split('/');

        // CASO A: Estamos viendo el DETALLE de una noticia
        if (url.includes('/detalle/')) {
          const entryId = segments[segments.length - 1]; // El ID siempre es el último

          return this.dataService.getEntryById(entryId).pipe(
            switchMap((entrada) => {
              // Usamos la subcategoría real que viene de tu Excel (ej: 'gastronomia')
              const subcatReal = entrada?.subcategoria || 'gastronomia';

              this.actualizarTitulo(subcatReal);

              return this.dataService
                .getEntriesBySubcategory(subcatReal)
                .pipe(map((entradas) => entradas.slice(0, 5)));
            }),
          );
        }

        // CASO B: Estamos en el LISTADO de una sección
        else {
          // Tomamos el último segmento (ej: agricultura, historia, gastronomia)
          const subcatUrl = segments[segments.length - 1] || 'gastronomia';

          this.actualizarTitulo(subcatUrl);

          return this.dataService
            .getEntriesBySubcategory(subcatUrl)
            .pipe(map((entradas) => entradas.slice(0, 5)));
        }
      }),
    );
  }

  private actualizarTitulo(subcat: string) {
  const nombres: any = {
    // TIERRA (Agricultura y más)
    'agricultura': 'Labores Agrícolas',
    'plantas-nativas': 'Flora de Ullulluco',
    'turismo': 'Rutas y Paisajes',

    // SABORES
    'gastronomia': 'Fogón y Tradición',
    'festividades': 'Calendario Comunal',

    // IDENTIDAD
    'historia': 'Raíces del Pueblo',
    'mitos-y-leyendas': 'Relatos Ancestrales'
  };
  
  // Si no encuentra la subcategoría, pone un título genérico pero elegante
  this.tituloSidebar = nombres[subcat] || 'Entradas Recientes';
}


}
