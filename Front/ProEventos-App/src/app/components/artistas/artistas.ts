import { Component } from '@angular/core';
import { TituloComponent } from '../../shared/titulo/titulo.component';

@Component({
  selector: 'app-artistas',
  standalone: true,
  imports: [TituloComponent],
  templateUrl: './artistas.html',
  styleUrls: ['./artistas.scss']
})
export class Artistas {
  tituloPagina = 'Artistas';
}
