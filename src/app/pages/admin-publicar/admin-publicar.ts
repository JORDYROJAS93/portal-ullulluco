import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../core/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
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

  idEdicion: string | null = null;

  categoriasMap: any = {
    identidad: ['historia', 'leyendas'],
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
  };

  ngOnInit() {
    this.idEdicion = this.route.snapshot.paramMap.get('id');
    if (this.idEdicion) {
      this.cargarDatosParaEditar(this.idEdicion);
    }
  }

  cargarDatosParaEditar(id: string) {
    this.dataService.getEntradaById(id).subscribe(entrada => {
      if (entrada) {
        this.nuevaEntrada = entrada;
        // Actualizamos las subcategorías según la categoría cargada
        this.onCategoriaChange();
      }
    });
  }

  onCategoriaChange() {
    this.subcategoriasDisponibles = this.categoriasMap[this.nuevaEntrada.categoria] || [];
  }

  async guardar() {
    if (!this.nuevaEntrada.titulo || !this.nuevaEntrada.categoria) {
      this.alertSvc.error('Campos incompletos', 'Por favor, completa el título y la categoría.');
      return;
    }

    try {
      if (this.idEdicion) {
        await this.dataService.updateEntrada(this.idEdicion, this.nuevaEntrada);
        this.alertSvc.success('¡Actualizado!', 'La entrada se actualizó correctamente.');
      } else {
        const dataParaEnviar = {
          ...this.nuevaEntrada,
          fecha: new Date().toISOString().split('T')[0],
          createdAt: new Date().getTime(),
        };
        await this.firebaseSvc.publicarHistoria(dataParaEnviar);
        this.alertSvc.success('¡Publicado!', 'La nueva historia ya está en el portal.');
      }
      this.limpiarFormulario();
    } catch (error) {
      console.error('Error:', error);
      this.alertSvc.error('Error de conexión', 'No se pudo guardar la información en Firebase.');
    }
  }


  limpiarFormulario() {
    this.nuevaEntrada = {
      titulo: '', categoria: '', subcategoria: '', resumen: '',
      contenido: '', imagen: '', imagen2: '', imagen3: '', autor: 'Jordy Rojas'
    };
    this.subcategoriasDisponibles = [];
    this.idEdicion = null;
  }
}
