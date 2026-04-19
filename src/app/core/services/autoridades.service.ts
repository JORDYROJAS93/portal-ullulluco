import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Autoridad {
  id?: string;
  ano_eleccion: string;
  periodo: string;
  cargo: string;
  nombre_autoridad: string;
  organizacion_politica: string;
}

@Injectable({ providedIn: 'root' })
export class AutoridadesService {
  private http = inject(HttpClient);
  private apiUrl = 'assets/data/db.json';

  getAutoridades(): Observable<Autoridad[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        // Invertimos el array de la propiedad autoridades para mostrar los más recientes
        const lista = res.autoridades || [];
        return [...lista].reverse();
      })
    );
  }
}