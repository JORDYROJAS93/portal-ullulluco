import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Definimos la estructura exacta de una noticia para que TypeScript nos ayude
export interface Noticia {
  id?: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagenUrl: string;
  fechaPublicacion: any; // Timestamp de Firebase
  autor: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  private firestore = inject(Firestore);
  private noticiasCollection = collection(this.firestore, 'noticias');

  constructor() {}

  /**
   * Obtiene todas las noticias ordenadas por fecha de publicación (de la más reciente a la más antigua)
   */
  getNoticias(): Observable<Noticia[]> {
    const q = query(this.noticiasCollection, orderBy('fechaPublicacion', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Noticia[]>;
  }

  /**
   * Obtiene los detalles de una sola noticia mediante su ID
   */
  getNoticiaById(id: string): Observable<Noticia | undefined> {
    const noticiaDocRef = doc(this.firestore, `noticias/${id}`);
    return docData(noticiaDocRef, { idField: 'id' }) as Observable<Noticia>;
  }
}