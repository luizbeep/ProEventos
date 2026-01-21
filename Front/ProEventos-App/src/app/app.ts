import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavComponent } from './shared/titulo/nav/nav.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    RouterOutlet,
    NgxSpinnerModule
  ],
  templateUrl: './app.html'
})
export class AppComponent {}
