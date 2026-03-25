import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importante para detectar el cambio

import { Observable, switchMap } from 'rxjs';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './listado.html',
  styleUrl: './listado.scss',
})
export class ListadoComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  entradas$!: Observable<any[]>;
  tituloCategoria: string = '';

  ngOnInit(): void {
    // Esto detecta el cambio de /gastronomia a /historia automáticamente
    this.entradas$ = this.route.url.pipe(
      switchMap(url => {
        const categoria = url[0]?.path || 'gastronomia';
        this.tituloCategoria = this.formatearTitulo(categoria);
        return this.dataService.getEntriesByCategory(categoria);
      })
    );
  }

  formatearTitulo(cat: string): string {
    const nombres: any = {
      'gastronomia': 'Gastronomía Ullulluco',
      'historia': 'Historia de Alfonso Ugarte',
      'festividades': 'Festividades y Costumbres',
      'agricultura': 'Agricultura Local',
      'turismo': 'Turismo en Ullulluco'
    };
    return nombres[cat] || 'Información';
  }
}