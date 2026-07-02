import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Pantalla de Inicio
  { 
    path: '', 
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) 
  },
  
  // Páginas con Diseño Único
  { 
    path: 'autoridades', 
    loadComponent: () => import('./features/portal/autoridades/autoridades').then(m => m.AutoridadesComponent) 
  },
  { 
    path: 'ubicacion', 
    loadComponent: () => import('./features/portal/ubicacion/ubicacion').then(m => m.UbicacionComponent) 
  },
  
  // Listados Dinámicos (Todos apuntan al mismo componente reutilizable)
  { 
    path: 'gastronomia', 
    loadComponent: () => import('./features/portal/listado/listado').then(m => m.ListadoComponent) 
  },
  { 
    path: 'festividades', 
    loadComponent: () => import('./features/portal/listado/listado').then(m => m.ListadoComponent) 
  },
  { 
    path: 'historia', 
    loadComponent: () => import('./features/portal/listado/listado').then(m => m.ListadoComponent) 
  },
  { 
    path: 'agricultura', 
    loadComponent: () => import('./features/portal/listado/listado').then(m => m.ListadoComponent) 
  },
  { 
    path: 'plantas-nativas', 
    loadComponent: () => import('./features/portal/listado/listado').then(m => m.ListadoComponent) 
  },
  { 
    path: 'leyendas', 
    loadComponent: () => import('./features/portal/listado/listado').then(m => m.ListadoComponent) 
  },
  { 
    path: 'artesania', 
    loadComponent: () => import('./features/portal/listado/listado').then(m => m.ListadoComponent) 
  },
  { 
    path: 'turismo', 
    loadComponent: () => import('./features/portal/listado/listado').then(m => m.ListadoComponent) 
  },
  { 
    path: 'anexos', 
    loadComponent: () => import('./features/portal/listado/listado').then(m => m.ListadoComponent) 
  },

  // Detalle de entradas (Gastronomía, Turismo, etc.)
  { 
    path: 'detalle/:category/:id', 
    loadComponent: () => import('./features/portal/detalle/detalle.component').then(m => m.DetalleComponent) 
  },

  // Administración y Autenticación
  { 
    path: 'login-admin', 
    loadComponent: () => import('./features/admin/pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'publicar-ullulluco', 
    loadComponent: () => import('./features/admin/pages/admin-publicar/admin-publicar').then(m => m.AdminPublicarComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'editar-entrada/:id', 
    loadComponent: () => import('./features/admin/pages/admin-publicar/admin-publicar').then(m => m.AdminPublicarComponent), 
    canActivate: [authGuard] 
  },

  // 🔥 NUEVAS RUTAS DE ADMINISTRACIÓN PARA NOTICIAS
  { 
    path: 'publicar-noticia', 
    loadComponent: () => import('./features/admin/pages/noticia-publicar/noticia-publicar.component').then(m => m.NoticiaPublicarComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'editar-noticia/:id', 
    loadComponent: () => import('./features/admin/pages/noticia-publicar/noticia-publicar.component').then(m => m.NoticiaPublicarComponent), 
    canActivate: [authGuard] 
  },

  // 🔥 NUEVA SECCIÓN DE NOTICIAS MODULAR
  {
    path: 'noticias',
    loadComponent: () => import('./features/noticias/pages/noticias-list/noticias-list.component').then(m => m.NoticiasListComponent)
  },
  {
    path: 'noticias/:id',
    loadComponent: () => import('./features/noticias/pages/noticia-detalle/noticia-detalle.component').then(m => m.NoticiaDetalleComponent)
  },

  // Redirección por si escriben algo mal (SIEMPRE AL FINAL)
  { path: '**', redirectTo: '' }
];