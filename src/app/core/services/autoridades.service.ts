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
  // Usa el ID de la nueva hoja de Google Sheets
  private apiUrl = 'https://api.sheetbest.com/sheets/cf504577-7f4e-4e07-a0f2-dbeb0b1b8f68/tabs/Hoja 2';

  getAutoridades(): Observable<Autoridad[]> {
    return this.http.get<Autoridad[]>(this.apiUrl).pipe(
      // Invertimos para que los más recientes salgan primero
      map(data => data.reverse())
    );
  }
}