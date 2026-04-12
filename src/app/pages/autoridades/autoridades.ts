import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Autoridad, AutoridadesService } from '../../core/services/autoridades.service';
import { map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-autoridades',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './autoridades.html',
  styleUrl: './autoridades.scss',
})
export class AutoridadesComponent implements OnInit {
  private authService = inject(AutoridadesService);
  gruposAutoridades$!: Observable<{ [key: string]: Autoridad[] }>;

  ngOnInit(): void {
    this.gruposAutoridades$ = this.authService.getAutoridades().pipe(
      map(data => {
        const agrupado = data.reduce((acc, curr) => {
          const periodo = curr.periodo;
          if (!acc[periodo]) acc[periodo] = [];
          acc[periodo].push(curr);
          return acc;
        }, {} as { [key: string]: Autoridad[] });

        // Ordenar internamente por ID
        Object.keys(agrupado).forEach(periodo => {
          agrupado[periodo].sort((a, b) => Number(a.id) - Number(b.id));
        });

        return agrupado;
      })
    );
  }

  getPeriodos(obj: any): string[] {
    return obj ? Object.keys(obj).sort((a, b) => b.localeCompare(a)) : [];
  }
}