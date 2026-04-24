import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; //
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
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
        // Usamos un pequeño delay técnico para evitar el error NG0100
        setTimeout(() => {
          this.cargando = true;
          const subcat = url[url.length - 1]?.path || 'gastronomia';
          this.tituloCategoria = this.formatearTitulo(subcat);
          this.cd.detectChanges();
        });
      }),
      switchMap((url) => {
        const subcat = url[url.length - 1]?.path || 'gastronomia';
        return this.firebaseService.getEntriesBySubcategory(subcat);
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
    };
    return nombres[subcat] || 'Información';
  }
}
