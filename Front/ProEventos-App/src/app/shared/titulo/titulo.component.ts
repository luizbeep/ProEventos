import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  standalone: true,
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent {
  @Input() texto: string = '';
  @Input() iconClass: string = 'fa fa-user';
  @Input() subtitulo: string = 'Desde 2026';
  @Input() botaoListar: boolean = false;

  constructor(private router: Router) {}

  listar(): void{
    this.router.navigate([`/${this.texto.toLocaleLowerCase()}/lista`]);
  }
}

