import { inject, Injectable } from '@angular/core';
import {
  Auth,
  user,
  User,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  ActionCodeSettings,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from '@angular/fire/auth'; // 👈 Todo desde aquí
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Observable que rastrea al usuario
  user$: Observable<User | null> = user(this.auth);

  // Selector de rol de administrador (Seguro)
  esAdmin$: Observable<boolean> = this.user$.pipe(
    switchMap((currentUser) => {
      if (!currentUser) return of(false);
      const userDocRef = doc(this.firestore, `usuarios/${currentUser.uid}`);
      return docData(userDocRef).pipe(map((perfil: any) => perfil?.rol === 'admin'));
    })
  );

  // 1. Login con Correo y Clave (Validación de verificación incluida)
  async loginConEmail(email: string, pass: string) {
    const result = await signInWithEmailAndPassword(this.auth, email, pass);
    
    // Si no verificó el correo, cortamos el acceso inmediatamente
    if (!result.user.emailVerified) {
      await signOut(this.auth);
      throw new Error('VERIFY_EMAIL');
    }
    return result;
  }

  // 2. Registro con Correo y Verificación
  async registrarConEmail(email: string, pass: string) {
  const result = await createUserWithEmailAndPassword(this.auth, email, pass);
  await sendEmailVerification(result.user); // Esto vuelve a usar el comportamiento estándar de Firebase
  return result;
}


async recuperarPassword(email: string) {
  return await sendPasswordResetEmail(this.auth, email);
}

  // 3. Login con Google
  async loginWithGoogle() {
    return await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

 

  // 5. Cierre de sesión
  async logout() {
    return await signOut(this.auth);
  }

  // Getter del usuario actual
  get currentUser() {
    return this.auth.currentUser;
  }
}