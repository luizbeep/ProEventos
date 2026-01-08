import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Eventos } from './eventos/eventos';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Eventos,
    PalestrantesComponent
  ],
  templateUrl: './app.html',
})
export class AppComponent {}
