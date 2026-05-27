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
    // 1. Intentamos recuperar los parámetros de forma síncrona para ganarle al Bot 206
    const idSnapshot = this.route.snapshot.paramMap.get('id');
    const catSnapshot = this.route.snapshot.paramMap.get('categoria');
    
    if (idSnapshot) {
      const categoriaFormateada = catSnapshot 
        ? catSnapshot.charAt(0).toUpperCase() + catSnapshot.slice(1) 
        : 'Cargando';
      
      // Forzamos un render síncrono inmediato con la categoría dinámica en la pestaña
      this.title.setTitle(`${categoriaFormateada} - Portal Ullulluco`);

      this.actualizarMetas({
        titulo: categoriaFormateada,
        resumen: 'Entérate de los detalles y novedades en nuestro Portal Institucional.',
        subcategoria: catSnapshot || 'noticia'
      }, idSnapshot);
    }

    // 2. Mantenemos el flujo asíncrono normal para los usuarios reales en el navegador
    this.entrada$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.dataService.getEntryById(id).pipe(
            tap((entrada) => {
              if (entrada) {
                this.nombreSubcategoria = entrada.subcategoria || 'atrás';
                this.categoriaActual = this.nombreSubcategoria.toLowerCase().replace(/\s+/g, '-');
                
                // Actualización en tiempo real para el navegador físico
                this.actualizarMetas(entrada, id);

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
    // Si viene el título real de Firebase lo usamos, si no, ponemos un genérico por defecto
    const tituloBase = entrada?.titulo || 'Detalle';
    
    // Armamos el título final unificado para la pestaña del navegador
    const tituloFinal = tituloBase.includes('Portal Ullulluco') ? tituloBase : `${tituloBase} - Portal Ullulluco`;
    
    const resumen = entrada?.resumen || 'Explora los detalles y novedades de nuestra tierra.';
    const imagen = entrada?.imagen || 'https://i.ibb.co/hFTwQg5s/destacado2.jpg';

    // Aplicamos el título dinámico completo a la pestaña
    this.title.setTitle(tituloFinal);
    
    const categoria = entrada?.subcategoria ? entrada.subcategoria.toLowerCase().replace(/\s+/g, '-') : 'noticia';
    const urlNoticia = `https://portal-ullulluco.vercel.app/detalle/${categoria}/${id}`;

    // Para las redes sociales mandamos el título base (limpio de marcas, se ve mejor al compartir)
    this.meta.updateTag({ property: 'og:title', content: tituloBase }, "property='og:title'");
    this.meta.updateTag({ property: 'og:description', content: resumen }, "property='og:description'");
    this.meta.updateTag({ property: 'og:image', content: imagen }, "property='og:image'");
    this.meta.updateTag({ property: 'og:url', content: urlNoticia }, "property='og:url'");
    this.meta.updateTag({ property: 'og:type', content: 'article' }, "property='og:type'");
    this.meta.updateTag({ property: 'og:image:width', content: '1200' }, "property='og:image:width'");
    this.meta.updateTag({ property: 'og:image:height', content: '630' }, "property='og:image:height'");
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