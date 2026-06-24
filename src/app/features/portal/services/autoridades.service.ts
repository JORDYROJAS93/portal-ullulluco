import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, orderBy, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Autoridad {
  firebase_id?: string;       // El ID automático de Firebase
  id?: number;                // El ID del 1 al 84 que viene del Excel
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

    /**
     * EXPLICACIÓN DEL ORDEN:
     * 1. 'ano_eleccion', 'desc': Pone los periodos más recientes arriba (ej: 2023 antes que 1963).
     * 2. 'id', 'asc': Dentro de cada periodo, respeta el orden del Excel (ID menor arriba).
     * Como el Alcalde tiene un ID menor que sus regidores en el Excel, saldrá primero.
     */
    const q = query(
      colRef, 
      orderBy('ano_eleccion', 'desc'), 
      orderBy('id', 'asc')
    );

    // Mapeamos los datos. 'idField' ahora se llama 'firebase_id' para no chocar 
    // con tu campo 'id' numérico del Excel.
    return collectionData(q, { idField: 'firebase_id' }) as Observable<Autoridad[]>;
  }
}