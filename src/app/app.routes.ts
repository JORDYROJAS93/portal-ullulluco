import { Routes } from '@angular/router';
import { ListadoComponent } from './features/listado/listado';
import { DetalleComponent } from './features/detalle/detalle.component';
import { HomeComponent } from './features/home/home';
import { UbicacionComponent } from './pages/ubicacion/ubicacion';
import { AutoridadesComponent } from './pages/autoridades/autoridades';

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

  // Detalle de entradas
  { path: 'detalle/:category/:id', component: DetalleComponent },

  // Redirección por si escriben algo mal
  { path: '**', redirectTo: '' }
];
