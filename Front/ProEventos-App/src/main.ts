import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

registerLocaleData(ptBr);

bootstrapApplication(AppComponent, {
  providers: [
    provideNoopAnimations(),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // adiciona pt-BR globalmente
    importProvidersFrom(
      BsDatepickerModule.forRoot(),
      ModalModule.forRoot(),
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
        progressBar: true
      })
    )
  ]
});
