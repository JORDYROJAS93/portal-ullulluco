import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router'; // 👈 Añadimos 'withInMemoryScrolling' aquí
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
// NUEVA IMPORTACIÓN
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideClientHydration } from '@angular/platform-browser'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    // 🚀 Configuración del Enrutador optimizada con la restauración de Scroll activa
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      })
    ), 
    
    provideHttpClient(),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()), 
    provideAuth(() => getAuth()),
    // CONFIGURACIÓN DE STORAGE
    provideStorage(() => getStorage()), 
    provideClientHydration(), 
  ]
};