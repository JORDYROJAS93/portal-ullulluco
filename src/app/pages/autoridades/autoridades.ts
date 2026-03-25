import { Component, inject, OnInit } from '@angular/core';
import { Autoridad, AutoridadesService } from '../../core/services/autoridades.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-autoridades',
  imports: [CommonModule,],
  templateUrl: './autoridades.html',
  styleUrl: './autoridades.scss',
})
export class AutoridadesComponent implements OnInit {

  private authService = inject(AutoridadesService);
 
  // Ahora manejaremos un objeto donde la llave es el "Periodo"
  gruposAutoridades$!: Observable<{ [key: string]: Autoridad[] }>;

  ngOnInit(): void {
  this.gruposAutoridades$ = this.authService.getAutoridades().pipe(
    map(data => {
      // 1. Agrupamos usando reduce
      const agrupado = data.reduce((acc, curr) => {
        const periodo = curr.periodo;
        if (!acc[periodo]) {
          acc[periodo] = [];
        }
        acc[periodo].push(curr);
        return acc;
      }, {} as { [key: string]: Autoridad[] });

      // 2. Ordenamos cada grupo internamente por ID
      // Usamos Object.keys para recorrer cada periodo y ordenar su lista de personas
      Object.keys(agrupado).forEach(periodo => {
        agrupado[periodo].sort((a, b) => {
          // Convertimos a número por si acaso el ID viene como texto desde el Excel
          return Number(a.id) - Number(b.id);
        });
      });

      return agrupado;
    })
  );
}

// Para que los periodos más recientes salgan primero en la página:
getPeriodos(obj: any): string[] {
  if (!obj) return [];
  
  return Object.keys(obj).sort((a, b) => {
    // Esto comparará "2023-2026" contra "1963-1966"
    // Al ser b - a, el más reciente sube al principio
    return b.localeCompare(a);
  });
}
}