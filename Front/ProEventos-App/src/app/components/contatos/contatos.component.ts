import { Component } from '@angular/core';
import { TituloComponent } from '../../shared/titulo/titulo.component';

@Component({
  selector: 'app-contatos',
  standalone: true,
  imports: [TituloComponent],
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent {
  tituloPagina = 'Contatos';
}
