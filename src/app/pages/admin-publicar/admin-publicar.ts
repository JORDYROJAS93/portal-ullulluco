import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../core/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-admin-publicar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-publicar.html',
  styleUrls: ['./admin-publicar.scss'],
})
export class AdminPublicarComponent implements OnInit {
  private alertSvc = inject(AlertService);
  private firebaseSvc = inject(FirebaseService);
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  idEdicion: string | null = null;
  guardando: boolean = false; // Bloqueador de botón
  hayCambios: boolean = false;
  datosOriginales: string = '';

  categoriasMap: any = {
    identidad: ['historia', 'leyendas','anexos'],
    sabores: ['gastronomia', 'festividades'],
    tierra: ['agricultura', 'plantas-nativas', 'turismo'],
  };

  subcategoriasDisponibles: string[] = [];

  nuevaEntrada: any = {
    titulo: '',
    categoria: '',
    subcategoria: '',
    resumen: '',
    contenido: '',
    imagen: '',
    imagen2: '',
    imagen3: '',
    autor: 'Jordy Rojas',
    publicado: false,
  };

  ngOnInit() {
    this.idEdicion = this.route.snapshot.paramMap.get('id');
    if (this.idEdicion) {
      this.cargarDatosParaEditar(this.idEdicion);
    }
  }

  onInput() {
    if (this.idEdicion) {
      this.hayCambios = JSON.stringify(this.nuevaEntrada) !== this.datosOriginales;
    } else {
      this.hayCambios = true;
    }
  }

  cargarDatosParaEditar(id: string) {
    this.dataService.getEntradaById(id).subscribe((entrada: any) => {
      if (entrada) {
        this.nuevaEntrada = { ...entrada };
        this.datosOriginales = JSON.stringify(entrada); // Guardamos copia
        this.onCategoriaChange();
        this.hayCambios = false;
      }
    });
  }

  onCategoriaChange() {
    this.subcategoriasDisponibles = this.categoriasMap[this.nuevaEntrada.categoria] || [];
  }

  // Función para guardar (tanto para crear como para actualizar)
  async guardar(estadoPublicacion: boolean) {
    // 1. Verificamos si ya se está procesando para evitar doble clic
    if (this.guardando) return;

    // 2. Validación de campos obligatorios
    if (!this.nuevaEntrada.titulo || !this.nuevaEntrada.categoria) {
      this.alertSvc.error('Campos incompletos', 'Por favor, completa el título y la categoría.');
      return;
    }

    // 3. Verificamos si realmente hay algo que hacer.
    // Si NO hay cambios en el texto Y el estado de publicación es el mismo que ya tiene...
    if (this.idEdicion && !this.hayCambios && this.nuevaEntrada.publicado === estadoPublicacion) {
      this.alertSvc.info('Sin cambios', 'La entrada ya se encuentra en ese estado y no tiene modificaciones.');
      return;
    }

    this.guardando = true; // Bloqueamos los botones

    try {
      const dataParaEnviar = {
        ...this.nuevaEntrada,
        publicado: estadoPublicacion, // <--- Aquí asignamos true o false
        fecha: this.nuevaEntrada.fecha || new Date().toISOString().split('T')[0],
        createdAt: this.nuevaEntrada.createdAt || new Date().getTime(),
      };

      if (this.idEdicion) {
        // ACTUALIZAR
        await this.dataService.updateEntrada(this.idEdicion, dataParaEnviar);
        this.alertSvc.success(
          '¡Actualizado!', 
          estadoPublicacion ? 'Publicado correctamente.' : 'Guardado como borrador.'
        );
      } else {
        // CREAR NUEVO
        await this.firebaseSvc.publicarHistoria(dataParaEnviar);
        this.alertSvc.success(
          '¡Éxito!', 
          estadoPublicacion ? 'La historia ya es pública.' : 'Guardada en borradores.'
        );
      }

      // Después de guardar con éxito, regresamos a la lista
      this.regresar();
      
    } catch (error) {
      this.guardando = false; // Si hay error, liberamos el botón para reintentar
      console.error('Error al guardar:', error);
      this.alertSvc.error('Error', 'No se pudo conectar con la base de datos.');
    }
  }

  // Función para eliminar
  async eliminar() {
    if (!this.idEdicion) return;

    const confirmar = await this.alertSvc.confirm(
      '¿Eliminar entrada?',
      'Esta acción no se puede deshacer.',
    );
    if (confirmar) {
      try {
        await this.dataService.deleteEntrada(this.idEdicion);
        this.alertSvc.success('Eliminado', 'La entrada ha sido borrada.');
        this.regresar();
      } catch (e) {
        this.alertSvc.error('Error', 'No se pudo eliminar.');
      }
    }
  }

  regresar() {
  const sub = this.nuevaEntrada.subcategoria;
  if (sub) {
    this.router.navigate(['/', sub]);
  } else {
    // Si por alguna razón no hay subcategoría, volvemos al panel o inicio
    this.router.navigate(['/']); 
  }
}

  limpiarFormulario() {
    this.nuevaEntrada = {
      titulo: '',
      categoria: '',
      subcategoria: '',
      resumen: '',
      contenido: '',
      imagen: '',
      imagen2: '',
      imagen3: '',
      autor: 'Jordy Rojas',
    };
    this.subcategoriasDisponibles = [];
    this.idEdicion = null;
  }




}
