import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // 👈 Añadimos ActivatedRoute
import { AuthService } from '../../../../core/services/auth.service';
import { take } from 'rxjs/operators';

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
  private route = inject(ActivatedRoute); // 👈 Inyectamos la ruta activa para leer los parámetros

  email: string = '';
  pass: string = '';
  error: string = '';
  returnUrl: string = '/noticias'; // 👈 Ruta por defecto si no se encuentra un origen previo

  ngOnInit() {
    // Capturamos el parámetro 'returnUrl' que viene en la URL si el usuario dio clic en Ingresar
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/noticias';
  }

  // 🛡️ Método centralizado para manejar la redirección inteligente según el rol del usuario
  private redirigirUsuario() {
    this.authService.esAdmin$.pipe(take(1)).subscribe(esAdmin => {
      if (esAdmin) {
        // Si es el Administrador de Ullulluco, va directo a su panel de gestión
        this.router.navigate(['/publicar-noticia']);
      } else {
        // Si es un vecino o usuario común, regresa exactamente a la noticia o sección donde estaba
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }

  // Método para Google
  async ingresarConGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.redirigirUsuario(); // 👈 Ejecuta la redirección dinámica
    } catch (err) {
      this.error = 'Error al conectar con Google.';
    }
  }

  // Método para Facebook
  async ingresarConFacebook() {
    try {
      await this.authService.loginWithFacebook();
      this.redirigirUsuario(); // 👈 Ejecuta la redirección dinámica
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
      this.redirigirUsuario(); // 👈 Ejecuta la redirección dinámica
    } catch (err) {
      this.error = 'Correo o contraseña incorrectos.';
    }
  }
}