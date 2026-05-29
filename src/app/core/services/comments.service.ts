import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, orderBy, collectionData, Timestamp, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// 1. CORREGIDO: Agregamos 'userId' a la interfaz para que TypeScript lo reconozca
export interface Comentario {
  id?: string;
  entradaId: string;
  texto: string;
  userName: string;
  userPhoto: string;
  userId: string; // <-- Línea agregada
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

  // 2. CORREGIDO: Adaptado a la sintaxis modular moderna de @angular/fire/firestore
  updateComment(id: string, nuevoTexto: string) {
    const docRef = doc(this.firestore, 'comentarios', id);
    return updateDoc(docRef, {
      texto: nuevoTexto,
      editadoEn: Timestamp.now()
    });
  }

  // 3. AGREGADO: Método definitivo para eliminar el documento por su ID físico
  deleteComment(id: string) {
    const docRef = doc(this.firestore, 'comentarios', id);
    return deleteDoc(docRef);
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