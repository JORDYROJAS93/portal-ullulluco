import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { Observable, filter, startWith, switchMap, map, of } from 'rxjs';

import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { NoticiasService } from '../../../features/noticias/services/noticias.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private noticiasService = inject(NoticiasService); // <-- Inyectamos tu servicio de noticias
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);
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
        
        // 1. Detectar si estamos en la sección de noticias
        if (url.includes('/noticias') || url.includes('/noticias/')) {
          
          setTimeout(() => {
            this.tituloSidebar = '📰 Noticias Recientes';
            this.cd.detectChanges();
          });

          // Consumimos tu servicio existente y mapeamos los campos para que encajen con la interfaz del sidebar (id, titulo, imagen, fecha)
          return this.noticiasService.getNoticias().pipe(
            map(noticias => noticias.slice(0, 5).map(n => ({
              id: n.id,
              titulo: n.titulo,
              imagen: n.imagenUrl || 'assets/images/placeholder-news.jpg', // Campo normalizado para el HTML
              fecha: n.fechaPublicacion?.seconds ? new Date(n.fechaPublicacion.seconds * 1000) : new Date(),
              categoria: 'noticias' // Para armar la ruta en el click si fuera necesario
            })))
          );
        }

        // 2. Si NO es noticias, se ejecuta tu lógica original de subcategorías impecable
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
            const esAdmin = !!this.authService.currentUser;
            const filtradas = esAdmin 
              ? entradas 
              : entradas.filter(e => e.publicado !== false);

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