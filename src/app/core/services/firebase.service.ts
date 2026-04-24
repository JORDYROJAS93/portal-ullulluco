import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  collectionData, 
  addDoc 
} from '@angular/fire/firestore'; // TODO desde @angular/fire
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // Usamos el inyector oficial de AngularFire
  private firestore = inject(Firestore);

  constructor() {}

  // Para el Listado (Gastronomía, etc)
  getEntriesBySubcategory(subcat: string): Observable<any[]> {
    try {
      // Usamos 'this.firestore' directamente
      const itemRef = collection(this.firestore, 'entradas');
      const q = query(itemRef, where('subcategoria', '==', subcat));
      
      // Retornamos los datos con el ID incluido
      return collectionData(q, { idField: 'id' }) as Observable<any[]>;
    } catch (error) {
      console.error("Error al crear la consulta de Firebase:", error);
      throw error;
    }
  }

  // Para tu Editor (Publicar historia)
  publicarHistoria(data: any) {
    const itemRef = collection(this.firestore, 'entradas');
    return addDoc(itemRef, data);
  }
}