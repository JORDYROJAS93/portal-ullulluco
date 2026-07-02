import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { NoticiasService, Noticia } from '../../services/noticias.service';
import { AuthService } from '../../../../core/services/auth.service'; // Asegúrate de que esta ruta sea la correcta
import { Observable } from 'rxjs';

@Component({
  selector: 'app-noticias-list',
  standalone: true,
  imports: [CommonModule, RouterModule,RouterLink],
  templateUrl: './noticias-list.component.html',
  styleUrls: ['./noticias-list.component.scss']
})
export class NoticiasListComponent {
  private noticiasService = inject(NoticiasService);
  public authService = inject(AuthService); 
  
  noticias$: Observable<Noticia[]> = this.noticiasService.getNoticias();
}