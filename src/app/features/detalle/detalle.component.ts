import { Component, inject, OnInit, PLATFORM_ID, Inject, AfterViewChecked } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService, Entrada } from '../../core/services/data.service';
import { Observable, switchMap, tap, of } from 'rxjs';
import { AutoridadesComponent } from '../../pages/autoridades/autoridades';
import { SafeHtmlPipe } from '../../core/pipes/safe-html-pipe';
import { ComentariosComponent } from '../../shared/components/comentarios/comentarios.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, AutoridadesComponent, SafeHtmlPipe, ComentariosComponent],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss',
})
export class DetalleComponent implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private meta = inject(Meta);
  private title = inject(Title);
  private platformId = inject(PLATFORM_ID);

  entrada$!: Observable<Entrada | undefined>;
  categoriaActual: string = '';
  nombreSubcategoria: string = '';

  imagenMaximizada: string | null = null;
  isZoomed: boolean = false;

  ngOnInit(): void {
    // Escuchamos los parámetros de la URL (Funciona en Servidor y Navegador)
    this.entrada$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.dataService.getEntryById(id).pipe(
            tap((entrada) => {
              if (entrada) {
                this.nombreSubcategoria = entrada.subcategoria || 'atrás';
                this.categoriaActual = this.nombreSubcategoria.toLowerCase().replace(/\s+/g, '-');
                
                // Se ejecuta SIEMPRE para que los robots lo lean
                this.actualizarMetas(entrada, id);

                // El scroll solo se ejecuta si estamos en el navegador real
                if (isPlatformBrowser(this.platformId)) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }
            })
          );
        }
        return of(undefined);
      })
    );
  }

  actualizarMetas(entrada: any, id: string) {
    this.title.setTitle(entrada.titulo);
    
    // Construimos la URL exacta de la noticia primero
    const categoria = entrada.subcategoria ? entrada.subcategoria.toLowerCase().replace(/\s+/g, '-') : 'noticia';
    const urlNoticia = `https://portal-ullulluco.vercel.app/detalle/${categoria}/${id}`;

    // Forzamos la remoción de las etiquetas previas para evitar que el servidor las duplique
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("property='og:image'");
    this.meta.removeTag("property='og:url'");
    this.meta.removeTag("property='og:type'");

    // Añadimos las etiquetas limpias y actualizadas de forma síncrona
    this.meta.addTags([
      { property: 'og:title', content: entrada.titulo },
      { property: 'og:description', content: entrada.resumen || 'Detalle de la noticia' },
      { property: 'og:image', content: entrada.imagen },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: urlNoticia }
    ]);
  }

  // MANEJO DE IMÁGENES Y MODALES (Solo en Navegador)
  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId)) {
      const imagenes = document.querySelectorAll('.img-ampliable');
      imagenes.forEach((img: any) => {
        if (!img.onclick) {
          img.style.cursor = 'zoom-in';
          img.onclick = () => this.abrirModal(img.src);
        }
      });
    }
  }

  abrirModal(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      const modal = document.createElement('div');
      modal.id = 'modal-foto';
      modal.innerHTML = `
        <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); 
                    display:flex; align-items:center; justify-content:center; z-index:10000; cursor:pointer;">
          <img src="${url}" style="max-width:90%; max-height:90%; border-radius:10px; box-shadow:0 0 20px black;">
          <span style="position:absolute; top:20px; right:30px; color:white; font-size:40px;">&times;</span>
        </div>
      `;
      modal.onclick = () => document.body.removeChild(modal);
      document.body.appendChild(modal);
    }
  }

  abrirImagen(url: string) {
    this.imagenMaximizada = url;
    this.isZoomed = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  cerrarImagen() {
    this.imagenMaximizada = null;
    this.isZoomed = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  toggleZoom(event: MouseEvent) {
    event.stopPropagation();
    this.isZoomed = !this.isZoomed;
  }
}