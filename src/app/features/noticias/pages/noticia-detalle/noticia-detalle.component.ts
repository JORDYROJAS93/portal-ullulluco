import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NoticiasService, Noticia } from '../../services/noticias.service';
import { Observable, switchMap } from 'rxjs';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html-pipe';

@Component({
  selector: 'app-noticia-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeHtmlPipe],
  templateUrl: './noticia-detalle.component.html',
  styleUrls: ['./noticia-detalle.component.scss']
})
export class NoticiaDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private noticiasService = inject(NoticiasService);

  noticia$!: Observable<Noticia | undefined>;

  noticiasRecientes$: Observable<Noticia[]> = this.noticiasService.getNoticias();

  ngOnInit(): void {
    // Escuchamos los cambios en la URL para capturar el ID de la noticia
    this.noticia$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id') || '';
        return this.noticiasService.getNoticiaById(id);
      })
    );
  }
}