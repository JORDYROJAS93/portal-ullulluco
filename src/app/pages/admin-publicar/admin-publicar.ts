import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../core/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AlertService } from '../../core/services/alert.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

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
  private storage = inject(Storage);

  idEdicion: string | null = null;
  guardando: boolean = false; 
  hayCambios: boolean = false;
  datosOriginales: string = '';
  subiendoArchivo: boolean = false;

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

  async subirArchivo(event: any, campo: string) {
    const file = event.target.files[0];
    if (!file) return;

    this.subiendoArchivo = true;
    this.guardando = true;

    const filePath = `entradas/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      this.nuevaEntrada[campo] = downloadURL;
      this.hayCambios = true;
      this.onInput();
      
      this.alertSvc.success('Imagen lista', 'Archivo cargado correctamente en Firebase.');
    } catch (error) {
      console.error('Error al subir:', error);
      this.alertSvc.error('Error', 'No se pudo subir la imagen.');
    } finally {
      this.subiendoArchivo = false;
      this.guardando = false;
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
        this.datosOriginales = JSON.stringify(entrada); 
        this.onCategoriaChange();
        this.hayCambios = false;
      }
    });
  }

  onCategoriaChange() {
    this.subcategoriasDisponibles = this.categoriasMap[this.nuevaEntrada.categoria] || [];
  }

  async guardar(estadoPublicacion: boolean) {
    if (this.guardando && !this.subiendoArchivo) return;

    if (!this.nuevaEntrada.titulo || !this.nuevaEntrada.categoria) {
      this.alertSvc.error('Campos incompletos', 'Por favor, completa el título y la categoría.');
      return;
    }

    if (this.idEdicion && !this.hayCambios && this.nuevaEntrada.publicado === estadoPublicacion) {
      this.alertSvc.success('Información', 'La entrada ya se encuentra en ese estado.');
      return;
    }

    this.guardando = true;

    try {
      const dataParaEnviar = {
        ...this.nuevaEntrada,
        publicado: estadoPublicacion,
        fecha: this.nuevaEntrada.fecha || new Date().toISOString().split('T')[0],
        createdAt: this.nuevaEntrada.createdAt || new Date().getTime(),
      };

      if (this.idEdicion) {
        await this.dataService.updateEntrada(this.idEdicion, dataParaEnviar);
        this.alertSvc.success('¡Actualizado!', estadoPublicacion ? 'Publicado correctamente.' : 'Guardado como borrador.');
      } else {
        await this.firebaseSvc.publicarHistoria(dataParaEnviar);
        this.alertSvc.success('¡Éxito!', estadoPublicacion ? 'La historia ya es pública.' : 'Guardada en borradores.');
      }
      this.regresar();
    } catch (error) {
      this.guardando = false;
      this.alertSvc.error('Error', 'No se pudo conectar con la base de datos.');
    }
  }

  async eliminar() {
    if (!this.idEdicion) return;
    const confirmar = await this.alertSvc.confirm('¿Eliminar entrada?', 'Esta acción no se puede deshacer.');
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
    this.router.navigate([sub ? '/' + sub : '/']);
  }

  limpiarFormulario() {
    this.nuevaEntrada = {
      titulo: '', categoria: '', subcategoria: '', resumen: '',
      contenido: '', imagen: '', imagen2: '', imagen3: '',
      autor: 'Jordy Rojas', publicado: false
    };
    this.subcategoriasDisponibles = [];
    this.idEdicion = null;
  }
}