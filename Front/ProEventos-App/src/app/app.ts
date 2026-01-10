import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { Eventos } from './eventos/eventos';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { NavComponent } from './nav/nav.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Eventos,
    PalestrantesComponent,
    NavComponent,
    CollapseModule,
    FormsModule
  ],
  templateUrl: './app.html',
})
export class AppComponent {}
