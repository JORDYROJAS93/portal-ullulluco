import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommentsService, Comentario } from '../../../core/services/comments.service';
import { AlertService } from '../../../core/services/alert.service'; // <-- Importamos tu servicio
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
  private alertService = inject(AlertService); // <-- Inyectamos tus alertas guindas

  comentarios$!: Observable<Comentario[]>;
  nuevoTexto: string = '';

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
      userId: user.uid,
      fecha: new Date()
    };

    await this.commentsService.addComment(comentario);
    this.nuevoTexto = ''; 
    this.alertService.success('¡Comentario publicado!', 'Tu aporte se ha sumado a la historia de Ullulluco.');
  }

  activarEdicion(comentario: Comentario) {
    if (!comentario.id) return;
    this.comentarioEditandoId = comentario.id;
    this.textoEditado = comentario.texto;
  }

  cancelarEdicion() {
    this.comentarioEditandoId = null;
    this.textoEditado = '';
  }

  async guardarEdicion(comentarioId: string | undefined) {
    if (!comentarioId || !this.textoEditado.trim()) return;
    
    await this.commentsService.updateComment(comentarioId, this.textoEditado);
    this.comentarioEditandoId = null;
    this.textoEditado = '';
    this.alertService.success('¡Comentario actualizado!', 'Los cambios se guardaron correctamente.');
  }

  async eliminarComentario(comentarioId: string | undefined) {
    if (!comentarioId) return;
    
    // 👇 Usamos tu confirmación personalizada de SweetAlert2
    const confirmar = await this.alertService.confirm(
      '¿Eliminar comentario?',
      'Esta acción no se puede deshacer. El comentario desaparecerá del portal.'
    );

    if (confirmar) {
      await this.commentsService.deleteComment(comentarioId);
      this.alertService.success('Eliminado', 'El comentario fue removido con éxito.');
    }
  }

  login() {
    this.authService.loginWithGoogle();
  }
}