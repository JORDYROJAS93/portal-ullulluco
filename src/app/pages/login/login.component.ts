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

  async ingresar() {
  try {
    // Usamos la función de Google que ya creamos en el AuthService
    await this.authService.loginWithGoogle();
    
    // Si el login es exitoso, Angular te mandará al creador de contenido
    // Pero el Guard verificará si TU correo es el autorizado
    this.router.navigate(['/publicar-ullulluco']);
  } catch (err) {
    this.error = 'No se pudo iniciar sesión con Google. Intenta de nuevo.';
    console.error(err);
  }
}
}