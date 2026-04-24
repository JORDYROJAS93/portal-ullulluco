import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommentsService, Comentario } from '../../../core/services/comments.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit {
  @Input() entradaId!: string; // Recibe el ID de la noticia desde el detalle
  
  public authService = inject(AuthService);
  private commentsService = inject(CommentsService);

  comentarios$!: Observable<Comentario[]>;
  nuevoTexto: string = '';

  ngOnInit() {
    this.comentarios$ = this.commentsService.getCommentsByEntrada(this.entradaId);
  }

  async enviarComentario(user: any) {
    if (!this.nuevoTexto.trim()) return;

    const comentario: Comentario = {
      entradaId: this.entradaId,
      texto: this.nuevoTexto,
      userName: user.displayName,
      userPhoto: user.photoURL,
      fecha: new Date()
    };

    await this.commentsService.addComment(comentario);
    this.nuevoTexto = ''; // Limpiar caja de texto
  }

  login() {
    this.authService.loginWithGoogle();
  }
}