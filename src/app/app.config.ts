import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'; // Cambiado aquí
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
// import { provideClientHydration } from '@angular/platform-browser'; // Coméntalo un momento

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withHashLocation()), 
    provideHttpClient(),

    // Inicialización limpia y única
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()), 
    provideAuth(() => getAuth()),
  ]
};