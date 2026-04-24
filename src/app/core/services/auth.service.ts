import { inject, Injectable } from '@angular/core';
import { Auth, user, User, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from '@angular/fire/auth'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  user$: Observable<User | null> = user(this.auth);

  // 1. Para que TÚ entres como Admin con correo/clave
  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // 2. Para que los USUARIOS comenten con Google
  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }
}