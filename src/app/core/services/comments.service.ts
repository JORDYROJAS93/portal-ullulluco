import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, orderBy, collectionData, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Comentario {
  id?: string;
  entradaId: string;
  texto: string;
  userName: string;
  userPhoto: string;
  fecha: any;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private firestore = inject(Firestore);

  // Guardar un nuevo comentario
  addComment(comentario: Comentario) {
    const col = collection(this.firestore, 'comentarios');
    return addDoc(col, { ...comentario, fecha: Timestamp.now() });
  }

  // Obtener comentarios de una noticia específica
  getCommentsByEntrada(entradaId: string): Observable<Comentario[]> {
    const col = collection(this.firestore, 'comentarios');
    const q = query(
      col, 
      where('entradaId', '==', entradaId),
      orderBy('fecha', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Comentario[]>;
  }
}