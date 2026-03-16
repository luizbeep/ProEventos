import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config'; // ← IMPORTA O appConfig

bootstrapApplication(AppComponent, appConfig) // ← USA O appConfig
  .catch((err) => console.error(err));
