import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // Alerta de éxito (para cuando publicas o editas)
  success(titulo: string, texto: string) {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: texto,
      confirmButtonColor: '#b01a1a', // El color guinda de tu portal
      timer: 2500,
      timerProgressBar: true
    });
  }

  // Alerta de error
  error(titulo: string, texto: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: texto,
      confirmButtonColor: '#b01a1a'
    });
  }

  // Alerta de confirmación (útil para borrar cosas después)
  async confirm(titulo: string, texto: string): Promise<boolean> {
    const result = await Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b01a1a',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  }
}