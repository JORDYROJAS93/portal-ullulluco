import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  pass: string = '';
  error: string = '';

  // Método para Google
  async ingresarConGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/publicar-ullulluco']);
    } catch (err) {
      this.error = 'Error al conectar con Google.';
    }
  }

  // Método para Facebook
  async ingresarConFacebook() {
    try {
      await this.authService.loginWithFacebook();
      this.router.navigate(['/publicar-ullulluco']);
    } catch (err) {
      this.error = 'Error al conectar con Facebook.';
      console.error(err);
    }
  }

  // Método para Correo Tradicional
  async ingresarConEmail() {
    if(!this.email || !this.pass) {
      this.error = 'Completa todos los campos.';
      return;
    }
    try {
      await this.authService.loginConEmail(this.email, this.pass);
      this.router.navigate(['/publicar-ullulluco']);
    } catch (err) {
      this.error = 'Correo o contraseña incorrectos.';
    }
  }
}