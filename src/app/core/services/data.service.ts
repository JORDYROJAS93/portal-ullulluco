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


  private scriptUrl = 'https://script.google.com/macros/s/AKfycbxN_b06ldesdPGYxkpB6DHgzLEMzEd00-xhQ0-0F5qqw1Fr0JaLDCtANJ5ve_K7PRct/exec';
  
 // URL específica para la Hoja 1
  private apiUrl = this.scriptUrl + '?sheet=Hoja1';
  
  // Función privada interna para no repetir código de ordenamiento
  private ordenarPorFecha(entradas: Entrada[]): Entrada[] {
    return entradas.sort((a, b) => {
      const dateA = new Date(a.fecha.split('/').reverse().join('-')).getTime();
      const dateB = new Date(b.fecha.split('/').reverse().join('-')).getTime();
      return dateB - dateA;
    });
  }

  // Obtiene TODO ordenado
  getAllEntriesSorted(): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiUrl).pipe(
      map((data: Entrada[]) => this.ordenarPorFecha(data))
    );
  }

  // Obtiene por subcategoría Y ORDENA (Esto arreglará el Sidebar)
  getEntriesBySubcategory(subcategory: string): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiUrl).pipe(
      map((data: Entrada[]) => {
        const filtrados = data.filter(item => item.subcategoria === subcategory);
        return this.ordenarPorFecha(filtrados);
      })
    );
  }

  // Obtiene por categoría Y ORDENA
  getEntriesByCategory(category: string): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiUrl).pipe(
      map((data: Entrada[]) => {
        const filtrados = data.filter(item => item.categoria === category);
        return this.ordenarPorFecha(filtrados);
      })
    );
  }

  getEntryById(id: string): Observable<Entrada | undefined> {
    return this.http.get<Entrada[]>(this.apiUrl).pipe(
      map((data: Entrada[]) => data.find(item => item.id === id))
    );
  }


  
}