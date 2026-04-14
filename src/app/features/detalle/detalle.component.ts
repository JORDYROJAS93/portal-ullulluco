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
}