import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';

// Firebase
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Autoridad, AutoridadesService } from '../../core/services/autoridades.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-autoridades',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './autoridades.html',
  styleUrl: './autoridades.scss',
})
export class AutoridadesComponent implements OnInit {
  private authService = inject(AutoridadesService);
  private firestore = inject(Firestore);
  private alertSvc = inject(AlertService);
  private auth = inject(Auth);

  gruposAutoridades$!: Observable<{ [key: string]: Autoridad[] }>;
  
  isAdmin = false; 
  mostrarFormulario = false;
  editando = false;
  autoridad: Autoridad = this.initAutoridad();

  ngOnInit(): void {
    // Detectar login para mostrar herramientas de admin
    authState(this.auth).subscribe(user => {
      this.isAdmin = !!user;
    });
    this.cargarDatos();
  }

  cargarDatos() {
    this.gruposAutoridades$ = this.authService.getAutoridades().pipe(
      map(data => {
        const agrupado = data.reduce((acc, curr) => {
          const periodo = curr.periodo;
          if (!acc[periodo]) acc[periodo] = [];
          acc[periodo].push(curr);
          return acc;
        }, {} as { [key: string]: Autoridad[] });

        Object.keys(agrupado).forEach(periodo => {
          agrupado[periodo].sort((a, b) => {
            if (a.cargo.toUpperCase().includes('ALCALDE')) return -1;
            if (b.cargo.toUpperCase().includes('ALCALDE')) return 1;
            return 0;
          });
        });
        return agrupado;
      })
    );
  }

  initAutoridad(): Autoridad {
    return { 
      nombre_autoridad: '', 
      cargo: 'ALCALDE DISTRITAL', 
      periodo: '', 
      ano_eleccion: new Date().getFullYear(), 
      organizacion_politica: '' 
    };
  }

  abrirNuevo() {
    this.autoridad = this.initAutoridad();
    this.editando = false;
    this.mostrarFormulario = true;
    this.scrollToForm();
  }

  editar(item: Autoridad) {
    this.autoridad = { ...item };
    this.editando = true;
    this.mostrarFormulario = true;
    this.scrollToForm();
  }

  async guardar() {
    if (!this.autoridad.nombre_autoridad || !this.autoridad.periodo) {
      this.alertSvc.error('Campos incompletos', 'Nombre y Periodo son requeridos.');
      return;
    }

    try {
      if (this.editando && this.autoridad.id) {
        const docRef = doc(this.firestore, `autoridades/${this.autoridad.id}`);
        const { id, ...data } = this.autoridad;
        await updateDoc(docRef, { ...data, ano_eleccion: Number(data.ano_eleccion) });
        this.alertSvc.success('Actualizado', 'Datos actualizados correctamente.');
      } else {
        const colRef = collection(this.firestore, 'autoridades');
        await addDoc(colRef, { ...this.autoridad, ano_eleccion: Number(this.autoridad.ano_eleccion) });
        this.alertSvc.success('Guardado', 'Se registró la nueva autoridad.');
      }
      this.cancelar();
    } catch (e) {
      this.alertSvc.error('Error', 'No se pudo procesar la solicitud.');
    }
  }

  async eliminar(id: string) {
    const confirm = await this.alertSvc.confirm('¿Eliminar?', 'Esta acción no se puede deshacer.');
    if (confirm) {
      await deleteDoc(doc(this.firestore, `autoridades/${id}`));
      this.alertSvc.success('Eliminado', 'El registro ha sido borrado.');
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.editando = false;
    this.autoridad = this.initAutoridad();
  }

  private scrollToForm() {
    setTimeout(() => {
      document.getElementById('form-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  getPeriodos(obj: any): string[] {
    return obj ? Object.keys(obj).sort((a, b) => b.localeCompare(a)) : [];
  }
}