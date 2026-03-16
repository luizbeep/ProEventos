import { Component, OnInit } from '@angular/core';
import { TituloComponent } from '../../shared/titulo/titulo.component';

@Component({
  selector: 'app-home',
  imports: [TituloComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tituloPagina = 'Home';

  constructor() { }

  ngOnInit() {
  }

}
