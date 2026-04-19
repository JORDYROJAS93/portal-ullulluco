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
  private apiUrl = './assets/data/db.json';

  getAutoridades(): Observable<Autoridad[]> {
    return this.http.get<any>(this.apiUrl).pipe( // Cambiado a <any> para acceder a la propiedad
      map(res => {
        // Accedemos directamente al cajón de autoridades
        const lista = res.autoridades || [];
        return [...lista].reverse();
      })
    );
  }
}