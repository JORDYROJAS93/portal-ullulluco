import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; //
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { DataService, Entrada } from '../../core/services/data.service';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listado.html',
  styleUrl: './listado.scss',
})
export class ListadoComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef); //

  entradas$!: Observable<Entrada[]>;
  tituloCategoria: string = '';
  cargando: boolean = true;

  ngOnInit(): void {
    this.entradas$ = this.route.url.pipe(
      tap((url) => {
        this.cargando = true;
        const subcat = url[url.length - 1]?.path || 'gastronomia';
        this.tituloCategoria = this.formatearTitulo(subcat);
        this.cd.detectChanges(); // Actualiza el título de inmediato
      }),
      switchMap((url) => {
        const subcat = url[url.length - 1]?.path || 'gastronomia';
        return this.dataService.getEntriesBySubcategory(subcat);
      }),
      tap(() => {
        this.cargando = false;
        this.cd.detectChanges(); // Muestra las cards apenas lleguen los datos
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
