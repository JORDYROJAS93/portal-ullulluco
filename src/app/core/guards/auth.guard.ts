import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators'; // 👈 Aseguramos el uso correcto de operadores

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Consumimos la verificación ciega desde Firestore
  return authService.esAdmin$.pipe(
    take(1),
    map(esAdmin => {
      if (esAdmin) {
        return true; // Bienvenida, el rol 'admin' fue verificado en base de datos
      } else {
        // Si no es admin, lanzamos la alerta protectora y redirigimos
        alert('Acceso denegado: Solo el administrador de Ullulluco tiene permiso.');
        return router.createUrlTree(['/login-admin']); 
      }
    })
  );
};