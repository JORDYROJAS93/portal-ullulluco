import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; //
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap, tap, map } from 'rxjs';
import { DataService, Entrada } from '../../core/services/data.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listado.html',
  styleUrl: './listado.scss',
})
export class ListadoComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef);
  public authService = inject(AuthService);

  entradas$!: Observable<any[]>;
  tituloCategoria: string = '';
  cargando: boolean = true;

  ngOnInit(): void {
    this.entradas$ = this.route.url.pipe(
      tap((url) => {
        setTimeout(() => {
          this.cargando = true;
          const subcat = url[url.length - 1]?.path || 'gastronomia';
          this.tituloCategoria = this.formatearTitulo(subcat);
          this.cd.detectChanges();
        });
      }),
      switchMap((url) => {
        const subcat = url[url.length - 1]?.path || 'gastronomia';
        
        // Combinamos la obtención de datos con el estado de autenticación
        return this.firebaseService.getEntriesBySubcategory(subcat).pipe(
          map(entradas => {
            // Obtenemos el usuario actual del authService (usando su valor actual)
            const esAdmin = !!this.authService.currentUser; 

            if (esAdmin) {
              // Si hay un usuario logueado (Admin), ve todo
              return entradas;
            } else {
              // Si es público, solo ve lo que NO es borrador
              return entradas.filter(e => e.publicado !== false);
            }
          })
        );
      }),
      tap(() => {
        setTimeout(() => {
          this.cargando = false;
          this.cd.detectChanges();
        });
      }),
    );
  }

  formatearTitulo(subcat: string): string {
    const nombres: any = {
      gastronomia: 'Gastronomía de Ullulluco',
      historia: 'Historia de Alfonso Ugarte',
      festividades: 'Festividades y Costumbres',
      agricultura: 'Nuestra Agricultura',
      turismo: 'Turismo en el Pueblo',
      leyendas: 'Mitos y Leyendas',
      'plantas-nativas': 'Flora Nativa',
      autoridades: 'Nuestras Autoridades',
      anexos: 'Anexos y Caseríos del Distrito',
    };
    return nombres[subcat] || 'Información';
  }
}
