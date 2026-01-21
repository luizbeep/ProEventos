import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-titulo',
  standalone: true,
  template: `<h1>{{ texto }}</h1>`
})
export class TituloComponent {
  @Input() texto!: string;
}
