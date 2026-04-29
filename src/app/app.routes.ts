import { Routes } from '@angular/router';
import { ListadoComponent } from './features/listado/listado';
import { DetalleComponent } from './features/detalle/detalle.component';
import { HomeComponent } from './features/home/home';
import { UbicacionComponent } from './pages/ubicacion/ubicacion';
import { AutoridadesComponent } from './pages/autoridades/autoridades';
import { AdminPublicarComponent } from './pages/admin-publicar/admin-publicar';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // Páginas con Diseño Único (Sin Sidebar probablemente)
  { path: 'autoridades', component: AutoridadesComponent },
  { path: 'ubicacion', component: UbicacionComponent },
  
  // Listados Dinámicos (Usan el mismo componente)
  { path: 'gastronomia', component: ListadoComponent },
  { path: 'festividades', component: ListadoComponent },
  { path: 'historia', component: ListadoComponent },
  { path: 'agricultura', component: ListadoComponent },
  { path: 'plantas-nativas', component: ListadoComponent },
  { path: 'leyendas', component: ListadoComponent },
  { path: 'artesania', component: ListadoComponent },
  { path: 'turismo', component: ListadoComponent },
  { path: 'anexos', component: ListadoComponent },

  // Detalle de entradas
  { path: 'detalle/:category/:id', component: DetalleComponent },

  { path: 'login-admin', component: LoginComponent },


  {path: 'publicar-ullulluco', component: AdminPublicarComponent, canActivate: [authGuard]},
  {   path: 'editar-entrada/:id', component: AdminPublicarComponent, canActivate: [authGuard] },

  // Redirección por si escriben algo mal
  { path: '**', redirectTo: '' }
];
