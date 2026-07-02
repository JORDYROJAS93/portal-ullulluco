import { inject, Injectable } from '@angular/core';
import { Auth, user, User, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from '@angular/fire/auth'; 
import { Firestore, doc, docData } from '@angular/fire/firestore'; // 👈 Añadimos los imports de Firestore
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators'; // 👈 Añadimos los operadores necesarios

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore); // 👈 Inyectamos Firestore de forma segura

  user$: Observable<User | null> = user(this.auth);

  // 🛡️ NUEVO: Flujo asíncrono seguro para el Guard y las plantillas reactivas (*ngIf)
  esAdmin$: Observable<boolean> = this.user$.pipe(
    switchMap(currentUser => {
      if (!currentUser) return of(false);
      
      // Apuntamos al documento dentro de la colección 'usuarios' usando el UID guardado
      const userDocRef = doc(this.firestore, `usuarios/${currentUser.uid}`);
      return docData(userDocRef).pipe(
        map((perfil: any) => perfil?.rol === 'admin')
      );
    })
  );

  // 1. Login con Correo y Clave
  loginConEmail(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // 2. Para que los USUARIOS comenten con Google
  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // 3. Login con Facebook (NUEVO)
  loginWithFacebook() {
    return signInWithPopup(this.auth, new FacebookAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }
  
  get currentUser() {
    return this.auth.currentUser; 
  }


}