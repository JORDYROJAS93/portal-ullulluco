import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NoticiasService, Noticia } from '../../../noticias/services/noticias.service';
import { AlertService } from '../../../../core/services/alert.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Firestore, doc, collection, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-noticia-publicar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './noticia-publicar.component.html',
  styleUrls: ['./noticia-publicar.component.scss']
})
export class NoticiaPublicarComponent implements OnInit {
  private alertSvc = inject(AlertService);
  private noticiasService = inject(NoticiasService);
  private firestore = inject(Firestore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private storage = inject(Storage);

  idEdicion: string | null = null;
  guardando: boolean = false;
  subiendoArchivo: boolean = false;
  hayCambios: boolean = false;
  datosOriginales: string = '';

  nuevaNoticia: Noticia = {
    titulo: '',
    resumen: '',
    contenido: '',
    imagenUrl: '',
    autor: 'Prensa Institucional',
    publicado: false,
    fechaPublicacion: null
  };

  ngOnInit() {
    this.idEdicion = this.route.snapshot.paramMap.get('id');
    if (this.idEdicion) {
      this.cargarNoticiaParaEditar(this.idEdicion);
    }
  }

  cargarNoticiaParaEditar(id: string) {
    this.noticiasService.getNoticiaById(id).subscribe(noticia => {
      if (noticia) {
        this.nuevaNoticia = { ...noticia };
        this.datosOriginales = JSON.stringify(noticia);
        this.hayCambios = false;
      }
    });
  }

  onInput() {
    if (this.idEdicion) {
      this.hayCambios = JSON.stringify(this.nuevaNoticia) !== this.datosOriginales;
    } else {
      this.hayCambios = true;
    }
  }

  async subirFoto(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.subiendoArchivo = true;
    this.guardando = true;

    const filePath = `noticias/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      this.nuevaNoticia.imagenUrl = downloadURL;
      this.onInput();
      this.alertSvc.success('Imagen lista', 'Foto subida correctamente a Firebase.');
    } catch (error) {
      this.alertSvc.error('Error', 'No se pudo cargar la imagen.');
    } finally {
      this.subiendoArchivo = false;
      this.guardando = false;
    }
  }

  async guardar() {
    if (this.guardando && !this.subiendoArchivo) return;

    if (!this.nuevaNoticia.titulo || !this.nuevaNoticia.resumen || !this.nuevaNoticia.contenido) {
      this.alertSvc.error('Campos obligatorios', 'Por favor, llena el título, resumen y contenido.');
      return;
    }

    this.guardando = true;

    try {
      if (this.idEdicion) {
        const docRef = doc(this.firestore, `noticias/${this.idEdicion}`);
        await updateDoc(docRef, { ...this.nuevaNoticia });
        this.alertSvc.success('¡Actualizada!', 'Noticia modificada correctamente.');
      } else {
        const docRef = doc(collection(this.firestore, 'noticias'));
        const dataParaEnviar = {
          ...this.nuevaNoticia,
          fechaPublicacion: new Date()
        };
        await setDoc(docRef, dataParaEnviar);
        this.alertSvc.success('¡Publicada!', 'La noticia ya está en vivo en el portal.');
      }
      this.router.navigate(['/noticias']);
    } catch (error) {
      this.alertSvc.error('Error', 'No se pudieron salvar los datos.');
    } finally {
      this.guardando = false;
    }
  }

  async eliminar() {
    if (!this.idEdicion) return;
    const confirmar = await this.alertSvc.confirm('¿Eliminar noticia?', 'Esta acción quitará la noticia del portal de inmediato.');
    if (confirmar) {
      try {
        const docRef = doc(this.firestore, `noticias/${this.idEdicion}`);
        await deleteDoc(docRef);
        this.alertSvc.success('Eliminado', 'La noticia ha sido borrada.');
        this.router.navigate(['/noticias']);
      } catch (e) {
        this.alertSvc.error('Error', 'No se pudo eliminar.');
      }
    }
  }
}