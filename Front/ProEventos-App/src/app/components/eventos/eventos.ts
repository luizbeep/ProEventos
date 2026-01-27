import {
  Component,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  afterNextRender,
  TemplateRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/Evento';
import { DateTimeFormatPipe } from "../../helpers/DateTimeFormat.pipe";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TituloComponent } from '../../shared/titulo/titulo.component';
import { RouterOutlet } from "@angular/router";





@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule,
    CollapseModule,
    FormsModule,
    DateTimeFormatPipe,
    TituloComponent,
    CommonModule,
    TooltipModule,
    RouterOutlet
],
  providers: [EventoService],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.scss'],
})
export class Eventos {
  modalRef?: BsModalRef;

  isCollapsed = true;

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public widthImg: number = 120;
  public marginImg: number = 2;
  public exibirImagem: boolean = true;
  private _filtroLista: string = '';
  public tituloPagina = 'Eventos';


  public get filtroLista(){
    return this._filtroLista
  }

  public listarEventos = false;

  public toggleEventos() {
    this.listarEventos = !this.listarEventos; // alterna entre true/false

    if (this.listarEventos) {
      this.getEventos(); // só carrega os eventos quando for mostrar
    }
  }
  public set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(evento =>
      evento.tema.toLocaleLowerCase().includes(filtrarPor) ||
      evento.local.toLocaleLowerCase().includes(filtrarPor) ||
      (evento.dataEvento &&
        evento.dataEvento.toString().toLocaleLowerCase().includes(filtrarPor))
    );
  }



  public alterarImagem():void{
  this.exibirImagem = !this.exibirImagem;
  }

  constructor(
  private eventoService: EventoService,
  private cdr: ChangeDetectorRef,
  private modalService: BsModalService,
  private toastr: ToastrService,
  private spinner: NgxSpinnerService,
  @Inject(PLATFORM_ID) private platformId: Object,


) {
  afterNextRender(() => {
    if (isPlatformBrowser(this.platformId)) {
      this.getEventos();
    }
  });
}


    openModal(template: TemplateRef<any>) {
      if (this.modalRef) {
        this.modalRef.hide();
      }

      this.modalRef = this.modalService.show(template);
    }


    confirm() {
    console.log('Confirmado');
    this.modalRef?.hide();
    this.toastr.success('O evento foi deletado com sucesso!');
  }

  decline() {
    console.log('Cancelado');
    this.modalRef?.hide();
  }


public getEventos(): void {
  this.spinner.show();

  this.eventoService.getEventos().subscribe({
    next: response => {
      this.eventos = response;
      this.eventosFiltrados = this.eventos;
      this.cdr.detectChanges();
    },
    error: () => {
      this.toastr.error('Erro ao carregar eventos');
      this.spinner.hide();
    },
    complete: () => {
      this.spinner.hide();
    }
  });
}








}
