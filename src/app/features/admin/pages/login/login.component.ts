import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { take } from 'rxjs/operators';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signOut 
} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email: string = '';
  pass: string = '';
  error: string = '';
  isLoading: boolean = false; // 👈 Evita doble clic
  esRegistro: boolean = false; // 👈 Alterna vista de Registro/Login
  returnUrl: string = '/noticias';
  esRecuperacion: boolean = false;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/noticias';
  }

  private redirigirUsuario() {
    this.authService.esAdmin$.pipe(take(1)).subscribe(esAdmin => {
      this.router.navigateByUrl(esAdmin ? '/publicar-noticia' : this.returnUrl);
    });
  }

  // --- MÉTODOS DE ACCESO ---

  async ingresarConEmail() {
    if (!this.email || !this.pass) {
      this.error = 'Completa todos los campos.';
      return;
    }
    this.isLoading = true;
    this.error = '';
    try {
      await this.authService.loginConEmail(this.email, this.pass);
      this.redirigirUsuario();
    } catch (err: any) {
      this.error = err.message === 'VERIFY_EMAIL' 
        ? '⚠️ Revisa tu correo: enlace de verificación enviado.' 
        : '❌ Correo o contraseña incorrectos.';
    } finally {
      this.isLoading = false;
    }
  }

async registrarUsuario() {
  if (!this.email || !this.pass) {
    this.error = 'Completa todos los campos.';
    return;
  }
  
  this.isLoading = true;
  this.error = '';
  
  try {
    // El servicio ya crea el usuario y envía el correo con tu nueva URL
    await this.authService.registrarConEmail(this.email, this.pass);
    
    // Si llega aquí, es éxito total
    this.error = '✅ ¡Cuenta creada! Revisa tu correo para activar.';
    this.esRegistro = false; // Regresa al login
    
  } catch (err: any) {
    // 🛡️ AQUÍ ESTÁ EL MANEJO DE ERRORES REAL
    if (err.code === 'auth/email-already-in-use') {
      this.error = 'Este correo ya tiene cuenta. ¿Olvidaste tu contraseña o quieres iniciar sesión?';
      this.esRegistro = false; 
    } else if (err.code === 'auth/weak-password') {
      this.error = 'La contraseña es muy corta (mínimo 6 caracteres).';
    } else {
      this.error = 'Error al crear la cuenta. Intenta nuevamente.';
      console.error(err); // Esto te dirá en la consola qué pasó realmente
    }
  } finally {
    this.isLoading = false;
  }
}

  async ingresarConGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.redirigirUsuario();
    } catch (err) {
      this.error = 'Error al conectar con Google.';
    }
  }

  async reenviarVerificacion() {
  this.isLoading = true;
  try {
    const user = this.authService.currentUser; // Obtiene el usuario actual
    if (user) {
      await sendEmailVerification(user); // Reenvía el link
      this.error = '✅ Correo reenviado. Revisa tu bandeja de entrada.';
    }
  } catch (err) {
    this.error = '❌ No se pudo reenviar el correo. Intenta de nuevo más tarde.';
  } finally {
    this.isLoading = false;
  }
}

async solicitarRestablecimiento() {
  if (!this.email) {
    this.error = 'Por favor, ingresa tu correo electrónico.';
    return;
  }
  this.isLoading = true;
  try {
    await this.authService.recuperarPassword(this.email);
    this.error = '✅ Correo enviado. Revisa tu bandeja de entrada para cambiar tu contraseña.';
    this.esRecuperacion = false;
  } catch (err) {
    this.error = '❌ Error: Asegúrate de que el correo sea correcto.';
  } finally {
    this.isLoading = false;
  }
}

  
}