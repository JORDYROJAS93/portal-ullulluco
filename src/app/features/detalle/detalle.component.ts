import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService, Entrada } from '../../core/services/data.service';
import { Observable } from 'rxjs';
import { AutoridadesComponent } from '../../pages/autoridades/autoridades';

@Component({
  selector: 'app-detalle',
  imports: [CommonModule, RouterLink, AutoridadesComponent],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss',
})
export class DetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);

  // Usamos la interfaz Entrada que definiste en el servicio
  entrada$!: Observable<Entrada | undefined>;
  categoriaActual: string = '';

  ngOnInit(): void {
    // 1. Obtenemos los parámetros de la URL: /detalle/:category/:id
    const category = this.route.snapshot.paramMap.get('category');
    const id = this.route.snapshot.paramMap.get('id');

    if (category && id) {
      this.categoriaActual = category;

      // 2. Llamamos al servicio usando la categoría REAL del post
      // Esto evita que busque Historia en el JSON de Gastronomía
      this.entrada$ = this.dataService.getEntryById(category, id);
    }
  }

  // Método auxiliar para el botón de "Volver"
  get volverRuta(): string {
    return `/${this.categoriaActual}`;
  }

  imagenMaximizada: string | null = null; // Guardará la URL de la foto abierta
  isZoomed: boolean = false; // Para controlar el estado del zoom

  abrirImagen(url: string) {
    this.imagenMaximizada = url;
    this.isZoomed = false; // Empezamos sin zoom
    // Bloqueamos el scroll del cuerpo para que no se mueva el fondo
    document.body.style.overflow = 'hidden';
  }

  cerrarImagen() {
    this.imagenMaximizada = null;
    this.isZoomed = false;
    document.body.style.overflow = 'auto';
  }

  toggleZoom(event: MouseEvent) {
    event.stopPropagation(); // Evita que se cierre el modal al hacer clic en la foto
    this.isZoomed = !this.isZoomed;
  }



}
