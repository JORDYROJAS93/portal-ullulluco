import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
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

  entradas$!: Observable<Entrada[]>;
  tituloCategoria: string = '';

  ngOnInit(): void {
    // Escucha cambios en la URL (ej: de /gastronomia a /leyendas)
    this.entradas$ = this.route.url.pipe(
      switchMap(url => {
        // Obtenemos la última parte de la ruta
        const subcat = url[url.length - 1]?.path || 'gastronomia';
        
        // Ponemos el título bonito arriba
        this.tituloCategoria = this.formatearTitulo(subcat);
        
        // Llamamos a la función que acabamos de crear en el servicio
        return this.dataService.getEntriesBySubcategory(subcat);
      })
    );
  }

  formatearTitulo(subcat: string): string {
    const nombres: any = {
      'gastronomia': 'Gastronomía de Ullulluco',
      'historia': 'Historia de Alfonso Ugarte',
      'festividades': 'Festividades y Costumbres',
      'agricultura': 'Agricultura Local',
      'turismo': 'Turismo en el Pueblo',
      'leyendas': 'Mitos y Leyendas',
      'plantas-nativas': 'Flora Nativa',
      'autoridades': 'Nuestras Autoridades'
    };
    return nombres[subcat] || 'Información';
  }
}