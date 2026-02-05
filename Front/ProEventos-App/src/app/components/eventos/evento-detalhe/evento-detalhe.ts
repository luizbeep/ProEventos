import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/Evento';
import { DateTimeFormatPipe } from '../../../helpers/DateTimeFormat.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateTimeFormatPipe
  ],
  templateUrl: './evento-detalhe.html',
  styleUrls: ['./evento-detalhe.scss'],
})
export class EventoDetalhe implements AfterViewInit {
  evento: Evento = {} as Evento;
  estadoSalvar = 'post';

  @ViewChild('picker', { static: true })
  picker!: ElementRef<HTMLInputElement>;

  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

 private fp!: flatpickr.Instance;

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    this.carregarEvento();
    this.validation();

  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if(eventoIdParam !== null){
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+eventoIdParam).subscribe({
          next: (evento: Evento) => {
            this.evento = {...evento};
            this.form.patchValue({
            ...evento,
            dataEvento: evento.dataEvento
              ? new Date(evento.dataEvento)
              : null
          });
            this.fp?.setDate(
              this.form.get('dataEvento')?.value,
              false
            );
          },

          error: (error: any) => {
            this.spinner.hide();
            this.toastr.error('Não foi possível carregar os eventos. ')
            console.error(error);
          },
          complete: () => {this.spinner.hide()},
        })
    }
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(50)]
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.fp = flatpickr(this.picker.nativeElement, {
      locale: Portuguese,
      enableTime: true,
      time_24hr: true,

      dateFormat: 'Y-m-d H:i',
      altInput: true,
      altFormat: 'd/m/Y H:i',

      allowInput: true,

      onChange: (selectedDates) => {
        this.form.get('dataEvento')?.setValue(selectedDates[0]);
      }
    });
  }


  public resetForm(): void {
    this.form.reset();
  }

public salvarAlteracao(): void {
  if (this.form.invalid) return;

  this.spinner.show();

  const EventoParaApi = {
    ...this.form.value,
    dataEvento: new Date(this.form.value.dataEvento).toISOString()
  };

  if (this.estadoSalvar === 'post') {
    this.eventoService.postEvento(EventoParaApi).subscribe({
      next: () => {
        this.toastr.success('Evento salvo com sucesso!', 'Sucesso');
      },
      error: (error) => {
        console.log('ERROS DO BACKEND:', error.error?.errors);
        this.toastr.error('Erro ao salvar', 'Erro');
        this.spinner.hide();
      },
      complete: () => this.spinner.hide()
    });

  } else {
    this.eventoService.putEvento(this.evento.id, EventoParaApi).subscribe({
      next: () => {
        this.toastr.success('Evento atualizado com sucesso!', 'Sucesso');
      },
      error: (error) => {
        console.log('ERROS DO BACKEND:', error.error?.errors);
        this.toastr.error('Erro ao salvar', 'Erro');
        this.spinner.hide();
      },
      complete: () => this.spinner.hide()
    });
  }
}



}
