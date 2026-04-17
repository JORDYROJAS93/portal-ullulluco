import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService, Entrada } from '../../core/services/data.service';
import { Observable, tap } from 'rxjs';
import { AutoridadesComponent } from '../../pages/autoridades/autoridades';
import { SafeHtmlPipe } from '../../core/pipes/safe-html-pipe';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
 

@Component({
  selector: 'app-detalle',
  standalone: true,
  // Agregamos SidebarComponent a los imports
  imports: [CommonModule, RouterLink, AutoridadesComponent, SafeHtmlPipe],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss',
})
export class DetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);

  entrada$!: Observable<Entrada | undefined>;
  categoriaActual: string = '';
  nombreSubcategoria: string = '';

  imagenMaximizada: string | null = null;
  isZoomed: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.entrada$ = this.dataService.getEntryById(id).pipe(
        tap((entrada) => {
          if (entrada) {
            this.nombreSubcategoria = entrada.subcategoria || 'atrás';
            this.categoriaActual = this.nombreSubcategoria.toLowerCase().replace(/\s+/g, '-');
          }
        }),
      );
    }
  }

  abrirImagen(url: string) {
    this.imagenMaximizada = url;
    this.isZoomed = false;
    document.body.style.overflow = 'hidden';
  }

  cerrarImagen() {
    this.imagenMaximizada = null;
    this.isZoomed = false;
    document.body.style.overflow = 'auto';
  }

  toggleZoom(event: MouseEvent) {
    event.stopPropagation();
    this.isZoomed = !this.isZoomed;
  }

ngAfterViewChecked() {
    const imagenes = document.querySelectorAll('.img-ampliable');
    imagenes.forEach((img: any) => {
      // Evitamos duplicar el evento
      if (!img.onclick) {
        img.style.cursor = 'zoom-in';
        img.onclick = () => this.abrirModal(img.src);
      }
    });
  }

  abrirModal(url: string) {
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