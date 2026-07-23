// Va arrancar la aplicación
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Trae el componente raíz
import { appConfig } from './app/app.config'; // Trae la configuración global

bootstrapApplication(AppComponent, appConfig) // "Enciende" la aplicación
  .catch((err) => console.error(err)); // Si falla, lo muestra en consola
