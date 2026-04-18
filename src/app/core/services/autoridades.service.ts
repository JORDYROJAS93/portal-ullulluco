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
  private scriptUrl = 'https://script.google.com/macros/s/AKfycbxN_b06ldesdPGYxkpB6DHgzLEMzEd00-xhQ0-0F5qqw1Fr0JaLDCtANJ5ve_K7PRct/exec';
  
  // URL específica para la Hoja 2
   private apiUrl = this.scriptUrl + '?sheet=Hoja2';

  getAutoridades(): Observable<Autoridad[]> {
    return this.http.get<Autoridad[]>(this.apiUrl).pipe(
      // Invertimos para que los más recientes salgan primero
      map(data => data.reverse())
    );
  }
}