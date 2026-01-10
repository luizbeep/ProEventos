import {
  Component,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  afterNextRender
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule,
    CollapseModule,
    FormsModule

  ],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.scss'],
})
export class Eventos {

  isCollapsed = true;

  public eventos: any[] = [];
  public eventosFiltrados: any [] = [];
  widthImg: number = 120;
  marginImg: number = 2;
  exibirImagem: boolean = true;
  private _filtroLista: string = '';

  public get filtroLista(){
    return this._filtroLista
  }

  public set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || evento.dataEvento.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }


  alterarImagem(){
  this.exibirImagem = !this.exibirImagem;
  }

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.getEventos();
      }
    });
  }

  getEventos(): void {
    this.http.get<any[]>('http://localhost:5279/api/eventos')
      .subscribe({
        next: response => {
          this.eventos = response;
          this.eventosFiltrados = this.eventos;
          this.cdr.detectChanges();
        },
        error: err => console.error(err)
      });
  }
}
