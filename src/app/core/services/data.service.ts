import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Entrada {
  id: string;
  titulo: string;
  categoria: string;
  subcategoria: string; 
  resumen: string;
  contenido: string;
  imagen: string;
  imagen2?: string;
  imagen3?: string;
  fecha: string;
  enlace_imagen?: string;
  enlace_imagen2?: string;
  enlace_imagen3?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  
  // Tu URL de SheetBest
  private apiUrl = 'https://api.sheetbest.com/sheets/cf504577-7f4e-4e07-a0f2-dbeb0b1b8f68/tabs/Hoja 1';

  // NUEVA FUNCIÓN: Filtra por la columna 'subcategoria'
  getEntriesBySubcategory(subcategory: string): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiUrl).pipe(
      map((data: Entrada[]) => data.filter(item => item.subcategoria === subcategory))
    );
  }

  // Mantenemos esta por si la usas en otros lados
  getEntriesByCategory(category: string): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiUrl).pipe(
      map((data: Entrada[]) => data.filter(item => item.categoria === category))
    );
  }

  getEntryById(id: string): Observable<Entrada | undefined> {
    return this.http.get<Entrada[]>(this.apiUrl).pipe(
      map((data: Entrada[]) => data.find(item => item.id === id))
    );
  }
}