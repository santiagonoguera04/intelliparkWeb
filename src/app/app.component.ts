import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Importa el sistema de rutas

@Component({
  selector: 'app-root', // Coincide con <app-root> del index.html
  standalone: true, // Componente independiente (no necesita NgModule)
  imports: [RouterOutlet], // Habilita <router-outlet> en el template
  template: '<router-outlet />' // Solo tiene un router-outlet
})
export class AppComponent {}
