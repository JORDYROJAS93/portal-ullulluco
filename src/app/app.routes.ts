import { Routes } from '@angular/router';
import { ListadoComponent } from './features/listado/listado';
import { DetalleComponent } from './features/detalle/detalle.component';
import { HomeComponent } from './features/home/home';
import { UbicacionComponent } from './pages/ubicacion/ubicacion';
import { AutoridadesComponent } from './pages/autoridades/autoridades';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Ahora la raíz es el Home
  { path: 'gastronomia', component: ListadoComponent },
  { path: 'gastronomia', component: ListadoComponent },
  { path: 'festividades', component: ListadoComponent },
  { path: 'historia', component: ListadoComponent },
  { path: 'agricultura', component: ListadoComponent },
  { path: 'detalle/historia/historia-autoridades', component: AutoridadesComponent },
  { path: 'detalle/:category/:id', component: DetalleComponent },
  { path: 'ubicacion', component: UbicacionComponent },
  { path: 'autoridades', component: AutoridadesComponent },
];
