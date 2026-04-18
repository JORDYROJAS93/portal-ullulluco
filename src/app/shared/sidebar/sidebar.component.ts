import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; //
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { DataService, Entrada } from '../../core/services/data.service';
import { Observable, filter, startWith, switchMap, map, tap } from 'rxjs'; // Añadimos tap

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
  private cd = inject(ChangeDetectorRef); //

  recientes$!: Observable<Entrada[]>;
  tituloSidebar: string = 'Lo más reciente';

  ngOnInit(): void {
    this.recientes$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      switchMap(() => {
        const url = this.router.url;
        const segments = url.split('/');

        if (url.includes('/detalle/')) {
          const entryId = segments[segments.length - 1];

          return this.dataService.getEntryById(entryId).pipe(
            switchMap((entrada) => {
              const subcatReal = entrada?.subcategoria || 'gastronomia';
              this.actualizarTitulo(subcatReal);
              return this.dataService
                .getEntriesBySubcategory(subcatReal)
                .pipe(
                  map((entradas) => entradas.slice(0, 5)),
                  tap(() => this.cd.detectChanges()) // Fuerza la detección tras recibir datos
                );
            }),
          );
        } else {
          const subcatUrl = segments[segments.length - 1] || 'gastronomia';
          this.actualizarTitulo(subcatUrl);
          return this.dataService
            .getEntriesBySubcategory(subcatUrl)
            .pipe(
              map((entradas) => entradas.slice(0, 5)),
              tap(() => this.cd.detectChanges()) // Fuerza la detección tras recibir datos
            );
        }
      }),
    );
  }

  private actualizarTitulo(subcat: string) {
    const nombres: any = {
      'agricultura': 'Labores Agrícolas',
      'plantas-nativas': 'Flora de Ullulluco',
      'turismo': 'Rutas y Paisajes',
      'gastronomia': 'Fogón y Tradición',
      'festividades': 'Calendario Comunal',
      'historia': 'Raíces del Pueblo',
      'mitos-y-leyendas': 'Relatos Ancestrales'
    };
    this.tituloSidebar = nombres[subcat] || 'Entradas Recientes';
    this.cd.detectChanges(); // Asegura que el cambio de título se registre
  }
}