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
  @Input() entradaId!: string;
  
  public authService = inject(AuthService);
  private commentsService = inject(CommentsService);

  comentarios$!: Observable<Comentario[]>;
  nuevoTexto: string = '';

  // Variables de control para la edición
  comentarioEditandoId: string | null = null;
  textoEditado: string = '';

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
      userId: user.uid, // Guardamos el ID único del usuario
      fecha: new Date()
    };

    await this.commentsService.addComment(comentario);
    this.nuevoTexto = ''; 
  }

  // Activa el modo edición cargando el texto actual en la caja
  activarEdicion(comentario: Comentario) {
    if (!comentario.id) return;
    this.comentarioEditandoId = comentario.id;
    this.textoEditado = comentario.texto;
  }

  // Cancela la edición limpiando los estados
  cancelarEdicion() {
    this.comentarioEditandoId = null;
    this.textoEditado = '';
  }

  // Guarda los cambios directamente en Firebase
  async guardarEdicion(comentarioId: string | undefined) {
    if (!comentarioId || !this.textoEditado.trim()) return;
    
    await this.commentsService.updateComment(comentarioId, this.textoEditado);
    this.comentarioEditandoId = null;
    this.textoEditado = '';
  }

  async eliminarComentario(comentarioId: string | undefined) {
    if (!comentarioId) return;
    
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este comentario?');
    if (confirmar) {
      await this.commentsService.deleteComment(comentarioId);
    }
  }

  login() {
    this.authService.loginWithGoogle();
  }
}