import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, from } from 'rxjs';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  collectionData,
  doc,
  getDoc,
  DocumentSnapshot,
  updateDoc,
  docData,
} from '@angular/fire/firestore';

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
  providedIn: 'root',
})
export class DataService {
  private firestore = inject(Firestore);
  private collectionName = 'entradas'; // Nombre de tu colección en Firebase

  // Obtener todas las historias ordenadas por fecha
  getAllEntriesSorted(): Observable<Entrada[]> {
    const colRef = collection(this.firestore, this.collectionName);
    const q = query(colRef, orderBy('fecha', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Entrada[]>;
  }

  // Filtrar por subcategoría (usado en tu componente de Listado)
  getEntriesBySubcategory(subcategory: string): Observable<Entrada[]> {
    const colRef = collection(this.firestore, this.collectionName);
    const q = query(
      colRef,
      where('subcategoria', '==', subcategory),
      orderBy('fecha', 'desc'), // Firebase necesita un índice para esto, te avisará en consola
    );
    return collectionData(q, { idField: 'id' }) as Observable<Entrada[]>;
  }

  // Obtener una sola historia por ID (para la página de detalle)
  getEntryById(id: string): Observable<Entrada | undefined> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);

    // Convertimos la promesa de Firebase a un Observable de RxJS
    return from(getDoc(docRef)).pipe(
      map((snapshot: DocumentSnapshot) => {
        // <--- Aquí le decimos el tipo a snapshot
        if (snapshot.exists()) {
          const data = snapshot.data();
          return { id: snapshot.id, ...data } as Entrada;
        }
        return undefined;
      }),
    );
  }

  getEntradaById(id: string) {
  const docRef = doc(this.firestore, 'entradas', id);
  return docData(docRef, { idField: 'id' });
}

  async updateEntrada(id: string, data: any) {
    const docRef = doc(this.firestore, 'entradas', id); // 'entradas' es el nombre de tu colección
    return await updateDoc(docRef, data);
  }
}
