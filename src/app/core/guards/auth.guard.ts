import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user => {
      // AQUÍ PON TU CORREO DE GMAIL EXACTO
      const correoAdmin = 'alfonsougarteullulluco@gmail.com'; 

      if (user && user.email === correoAdmin) {
        return true; // Bienvenida, eres el administrador
      } else {
        // Si alguien más intenta entrar, le avisamos y lo botamos
        alert('Acceso denegado: Solo el administrador de Ullulluco tiene permiso.');
        return router.createUrlTree(['/login-admin']); 
      }
    })
  );
};