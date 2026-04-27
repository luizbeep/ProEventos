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
// REMOVA O DateTimeFormatPipe
// import { DateTimeFormatPipe } from '../../../helpers/DateTimeFormat.pipe';
import { TituloComponent } from '../../../shared/titulo/titulo.component';
import { environment } from '../../../../environments/environment';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginatedResult, Pagination } from '../../../models/Pagination';
import { debounce, debounceTime, Subject } from 'rxjs';

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
    PaginationModule,

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

  public pagination: Pagination = new Pagination();

  widthImg = 120;
  marginImg = 2;
  exibirImagem = true;


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
        this.pagination.CurrentPage = 1;
        this.pagination.ItemsPerPage = 3;
        this.carregarEventos();
      }
    });
  }

  formatarData(data: Date | string | undefined): string {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  }

  toggleEventos() {
    this.listarEventos = !this.listarEventos;
    if (this.listarEventos) {
      this.carregarEventos();
    }
  }

  termoBuscaChanged: Subject<string> = new Subject<string>();

  filtrarEventos(evt: any): void {
    if(this.termoBuscaChanged.observers.length == 0){
      this.termoBuscaChanged.pipe(debounceTime(500)).subscribe(
        filtrarPor => {
      this.eventoService.getEventos(
      this.pagination.CurrentPage,
      this.pagination.ItemsPerPage,
      filtrarPor
    ).subscribe({
      next: (paginatedResult: PaginatedResult<Evento[]>) => {
        console.log('📦 Dados recebidos:', {
          totalEventos: paginatedResult.result?.length,
          pagination: paginatedResult.pagination
        });

        this.eventos = paginatedResult.result ?? [];
        this.eventosFiltrados = [...this.eventos];

        console.log('📊 Eventos após atribuição:', this.eventos.length);
        console.log('🔢 Eventos filtrados:', this.eventosFiltrados.length);

        if (paginatedResult.pagination) {
          this.pagination = { ...paginatedResult.pagination };
          console.log('📄 Paginação atualizada:', this.pagination);
        }

        this.cdr.detectChanges();

        setTimeout(() => {
          this.spinner.hide();
          console.log('Spinner escondido');
        }, 100);
      },
      error: (error) => {
        console.error('Erro ao carregar eventos:', error);
        this.toastr.error('Erro ao carregar eventos');
      },
    })
        }
      )

    }
    this.termoBuscaChanged.next(evt.value);

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

  public pageChanged(event: any): void {
    this.pagination.CurrentPage = event.page;
    this.carregarEventos();
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

    this.eventoService.getEventos(
      this.pagination.CurrentPage,
      this.pagination.ItemsPerPage
    ).subscribe({
      next: (paginatedResult: PaginatedResult<Evento[]>) => {
        console.log('📦 Dados recebidos:', {
          totalEventos: paginatedResult.result?.length,
          pagination: paginatedResult.pagination
        });

        this.eventos = paginatedResult.result ?? [];
        this.eventosFiltrados = [...this.eventos];

        console.log('📊 Eventos após atribuição:', this.eventos.length);
        console.log('🔢 Eventos filtrados:', this.eventosFiltrados.length);

        if (paginatedResult.pagination) {
          this.pagination = { ...paginatedResult.pagination };
          console.log('📄 Paginação atualizada:', this.pagination);
        }

        this.cdr.detectChanges();

        setTimeout(() => {
          this.spinner.hide();
          console.log('✅ Spinner escondido');
        }, 100);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar eventos:', error);
        this.toastr.error('Erro ao carregar eventos');
      },
    });
  }
}
