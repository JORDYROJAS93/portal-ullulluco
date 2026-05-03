import { inject, Injectable } from '@angular/core';
import { Auth, user, User, GoogleAuthProvider,FacebookAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from '@angular/fire/auth'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  user$: Observable<User | null> = user(this.auth);

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
  // Esto retorna el usuario de Firebase si existe
  return this.auth.currentUser; 
}
}