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
  
  // Control del acordeón
  periodoExpandido: string | null = null;

  ngOnInit(): void {
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

  // Toggle del acordeón
  togglePeriodo(periodo: string) {
    if (this.periodoExpandido === periodo) {
      this.periodoExpandido = null; // Colapsar si ya está expandido
    } else {
      this.periodoExpandido = periodo; // Expandir nuevo y colapsar anterior
    }
  }

  // Verificar si está expandido
  isExpandido(periodo: string): boolean {
    return this.periodoExpandido === periodo;
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
    // Convertimos a número para asegurar que Firebase lo ordene bien
    const dataAProcesar = { 
      ...this.autoridad, 
      ano_eleccion: Number(this.autoridad.ano_eleccion),
      id: this.autoridad.id ? Number(this.autoridad.id) : 99 // Si es nuevo, le pone un número alto provisional
    };

    if (this.editando && this.autoridad.firebase_id) {
      // Usamos firebase_id para la ruta del documento
      const docRef = doc(this.firestore, `autoridades/${this.autoridad.firebase_id}`);
      
      // Quitamos los IDs del objeto que se guarda dentro de los campos de Firebase
      const { firebase_id, ...data } = dataAProcesar;
      await updateDoc(docRef, data);
      
      this.alertSvc.success('Actualizado', 'Datos actualizados correctamente.');
    } else {
      const colRef = collection(this.firestore, 'autoridades');
      await addDoc(colRef, dataAProcesar);
      this.alertSvc.success('Guardado', 'Se registró la nueva autoridad.');
    }
    this.cancelar();
  } catch (e) {
    console.error(e);
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

   // Obtener solo el alcalde (Acepta undefined)
  getAlcalde(periodoData: Autoridad[] | undefined): Autoridad | undefined {
    if (!periodoData) return undefined;
    return periodoData.find(p => p.cargo.toUpperCase().includes('ALCALDE'));
  }

  // Obtener regidores (Acepta undefined)
  getRegidores(periodoData: Autoridad[] | undefined): Autoridad[] {
    if (!periodoData) return []; // Si es null/undefined, devuelve array vacío
    return periodoData.filter(p => !p.cargo.toUpperCase().includes('ALCALDE'));
  }
}