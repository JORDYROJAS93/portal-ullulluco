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
  private apiUrl = 'assets/data/db.json';
  
  private ordenarPorFecha(entradas: Entrada[]): Entrada[] {
    return entradas.sort((a, b) => {
      const dateA = new Date(a.fecha.split('/').reverse().join('-')).getTime();
      const dateB = new Date(b.fecha.split('/').reverse().join('-')).getTime();
      return dateB - dateA;
    });
  }

  // Obtiene TODO ordenado accediendo a la propiedad .entradas
  getAllEntriesSorted(): Observable<Entrada[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => this.ordenarPorFecha(res.entradas))
    );
  }

  // Filtra por subcategoría accediendo a la propiedad .entradas
  getEntriesBySubcategory(subcategory: string): Observable<Entrada[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        const filtrados = res.entradas.filter((item: Entrada) => item.subcategoria === subcategory);
        return this.ordenarPorFecha(filtrados);
      })
    );
  }

  // Filtra por categoría accediendo a la propiedad .entradas
  getEntriesByCategory(category: string): Observable<Entrada[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        const filtrados = res.entradas.filter((item: Entrada) => item.categoria === category);
        return this.ordenarPorFecha(filtrados);
      })
    );
  }

  // Busca por ID accediendo a la propiedad .entradas
  getEntryById(id: string): Observable<Entrada | undefined> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res.entradas.find((item: Entrada) => item.id === id))
    );
  }
}