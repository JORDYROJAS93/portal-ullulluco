import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, orderBy, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Autoridad {
  id?: string;
  ano_eleccion: number;
  periodo: string;
  cargo: string;
  nombre_autoridad: string;
  organizacion_politica: string;
}

@Injectable({ providedIn: 'root' })
export class AutoridadesService {
  private firestore = inject(Firestore);

  getAutoridades(): Observable<Autoridad[]> {
    const colRef = collection(this.firestore, 'autoridades');
    // Ordenamos por año de elección para que los más recientes salgan primero
    const q = query(colRef, orderBy('ano_eleccion', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Autoridad[]>;
  }
}