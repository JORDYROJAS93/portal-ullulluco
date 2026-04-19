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
    tap(() => {
      this.cargando = true;
      // No es estrictamente necesario llamar a detectChanges aquí 
      // si el cambio de 'cargando' se gestiona en el tap final
    }),
    switchMap(url => {
      const subcat = url[url.length - 1]?.path || 'gastronomia';

      // ✅ CAMBIO CLAVE: Envolvemos la asignación del dato.
      // Esto saca la actualización del ciclo de vida actual de Angular.
      setTimeout(() => {
        this.tituloCategoria = this.formatearTitulo(subcat);
        this.cd.detectChanges(); // Opcional pero recomendado para asegurar la vista
      }, 0);

      return this.dataService.getEntriesBySubcategory(subcat);
    }),
    tap(() => {
      // ✅ También envolvemos el estado de carga para evitar el mismo error
      setTimeout(() => {
        this.cargando = false;
        this.cd.detectChanges();
      }, 0);
    })
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
