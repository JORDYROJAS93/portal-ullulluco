import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NoticiasService, Noticia } from '../../services/noticias.service';
import { Observable, switchMap } from 'rxjs';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html-pipe';
import { ComentariosComponent } from '../../../../shared/components/comentarios/comentarios.component';
// Importa el componente


@Component({
  selector: 'app-noticia-detalle',
  standalone: true,
  // Agrégalo aquí
  imports: [CommonModule, RouterModule, SafeHtmlPipe, ComentariosComponent],
  templateUrl: './noticia-detalle.component.html',
  styleUrls: ['./noticia-detalle.component.scss']
})
export class NoticiaDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private noticiasService = inject(NoticiasService);

  noticia$!: Observable<Noticia | undefined>;

  ngOnInit(): void {
    this.noticia$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id') || '';
        return this.noticiasService.getNoticiaById(id);
      })
    );
  }
}