import {
  Component,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  afterNextRender,
  TemplateRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/Evento';
import { DateTimeFormatPipe } from '../../../helpers/DateTimeFormat.pipe';
import { TituloComponent } from '../../../shared/titulo/titulo.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-evento-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CollapseModule,
    TooltipModule,
    RouterOutlet,
    RouterLink,
    TituloComponent,
    DateTimeFormatPipe
  ],
  providers: [EventoService, DatePipe],
  templateUrl: './evento-lista.html',
  styleUrls: ['./evento-lista.scss'],
})
export class EventoLista {
  modalRef?: BsModalRef;

  public tema: string = "";

  public eventoId: number = 0;

  isCollapsed = true;
  listarEventos = false;

  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];

  widthImg = 120;
  marginImg = 2;
  exibirImagem = true;

  private _filtroLista = '';
  tituloPagina = 'Eventos';

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = value
      ? this.filtrarEventos(value)
      : this.eventos;
  }

  constructor(
    private eventoService: EventoService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.carregarEventos();
      }
    });
  }

  toggleEventos() {
    this.listarEventos = !this.listarEventos;
    if (this.listarEventos) {
      this.carregarEventos();
    }
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLowerCase();
    return this.eventos.filter(evento =>
      evento.tema.toLowerCase().includes(filtrarPor) ||
      evento.local.toLowerCase().includes(filtrarPor) ||
      (evento.dataEvento?.toString().toLowerCase().includes(filtrarPor))
    );
  }

  alterarImagem() {
    this.exibirImagem = !this.exibirImagem;
  }

  public mostraImagem(imagemURL: string): string{
    return (imagemURL !== '')
    ? `${environment.apiUrl}Resources/Images/${imagemURL}`
    : 'assets/semImagem.png'
  }

  openModal(event: MouseEvent, template: TemplateRef<any>, tema: string, eventoId: number): void {
    event.stopPropagation();
    this.tema = tema;
    this.eventoId = eventoId;
    this.modalRef?.hide();
    this.modalRef = this.modalService.show(template);
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: any) => {
          console.log(result)
          this.toastr.success('O evento foi deletado com sucesso!', 'Deletado');
          this.carregarEventos();
          this.spinner.hide();
      },
      error: (error: any) => {
        console.error(error)
        this.spinner.hide();
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`);
      },
      complete: () =>{
        this.spinner.hide();
      }
    });
  }

  decline() {
    this.modalRef?.hide();
  }

  detalheEvento(id: number) {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  carregarEventos() {
    this.spinner.show();

    this.eventoService.getEventos().subscribe({
      next: response => {
        this.eventos = response;
        this.eventosFiltrados = response;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Erro ao carregar eventos');
        this.spinner.hide();
      },
      complete: () => this.spinner.hide(),
    });
  }
}
