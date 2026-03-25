import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Entrada {
  id: string;
  titulo: string;
  categoria: string;
  resumen: string;
  contenido: string;
  imagen: string;
  fecha: string;
  imagen2?: string;
  imagen3?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  
  private apiUrl = 'https://api.sheetbest.com/sheets/cf504577-7f4e-4e07-a0f2-dbeb0b1b8f68/tabs/Hoja 1';

  // Obtener todas las entradas de una categoría
  getEntriesByCategory(category: string): Observable<Entrada[]> {
    // Le decimos a map que 'data' es un arreglo de Entrada
    return this.http.get<Entrada[]>(this.apiUrl).pipe(
      map((data: Entrada[]) => data.filter((item: Entrada) => item.categoria === category))
    );
  }

  // Obtener una sola entrada por ID
  getEntryById(category: string, id: string): Observable<Entrada | undefined> {
    return this.http.get<Entrada[]>(this.apiUrl).pipe(
      map((data: Entrada[]) => data.find((item: Entrada) => item.id === id && item.categoria === category))
    );
  }

  // Obtener las últimas 3 entradas para el Sidebar
  getLatest(category: string): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiUrl).pipe(
      map((data: Entrada[]) => 
        data
          .filter((item: Entrada) => item.categoria === category)
          .reverse()
          .slice(0, 3)
      )
    );
  }
}