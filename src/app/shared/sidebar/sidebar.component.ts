import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { FirebaseService } from '../../core/services/firebase.service'; // Usamos FirebaseService
import { Observable, filter, startWith, switchMap, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef); // Inyectamos el detector de cambios
  public authService = inject(AuthService);

  recientes$!: Observable<any[]>;
  tituloSidebar: string = 'Lo más reciente';

  ngOnInit(): void {
    this.recientes$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(new NavigationEnd(0, this.router.url, this.router.url)),
      switchMap(() => {
        const url = this.router.url;
        const segments = url.split('/');
        
        let subcat = 'gastronomia';
        if (url.includes('/detalle/')) {
          subcat = segments[segments.length - 2] || 'gastronomia';
        } else {
          subcat = segments[segments.length - 1] || 'gastronomia';
        }

        setTimeout(() => {
          this.actualizarTitulo(subcat);
          this.cd.detectChanges();
        });

        return this.firebaseService.getEntriesBySubcategory(subcat).pipe(
          map(entradas => {
            // 1. Verificamos si es admin (si existe sesión de usuario)
            const esAdmin = !!this.authService.currentUser;

            // 2. Filtramos: Si es admin ve todo, si no, solo lo publicado
            const filtradas = esAdmin 
              ? entradas 
              : entradas.filter(e => e.publicado !== false);

            // 3. Devolvemos solo las 5 más recientes del resultado filtrado
            return filtradas.slice(0, 5);
          })
        );
      })
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
      'leyendas': 'Relatos Ancestrales'
    };
    this.tituloSidebar = nombres[subcat] || 'Entradas Recientes';
  }
}