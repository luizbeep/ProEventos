import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/Evento';
import { DateTimeFormatPipe } from '../../../helpers/DateTimeFormat.pipe';
import { ToastrService } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Lote } from '../../../models/Lote';
import { LoteService } from '../../../services/lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangeDetectorRef } from '@angular/core';
import { NgxCurrencyDirective } from 'ngx-currency';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-evento-detalhe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateTimeFormatPipe,
    NgxCurrencyDirective,
    TooltipModule
  ],
  templateUrl: './evento-detalhe.html',
  styleUrls: ['./evento-detalhe.scss'],
})
export class EventoDetalhe implements AfterViewInit {
  evento: Evento = {} as Evento;
  estadoSalvar = 'post';
  public eventoId!: number;
  modalRef?: BsModalRef;
  loteAtual = {id: 0, nome: '', indice: 0};
  imagemURL: string = 'assets/upload.png';
  file!: File;

  private lotesFlatpickrInstances: { [key: string]: flatpickr.Instance } = {};
  @ViewChild('picker', { static: true })
  picker!: ElementRef<HTMLInputElement>;

  form!: FormGroup;
  private fp!: flatpickr.Instance;

  get lotes(): FormArray{
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get modoEditar(): boolean{
    return this.estadoSalvar == 'put';
  }

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private loteService: LoteService
  ) {
    this.validation();
    this.carregarEvento();
  }

  private formatDatePtBr(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
  }

  private initLoteDatePicker(inputElement: HTMLInputElement, campo: 'dataInicio' | 'dataFim', formGroupIndex: number): void {
    const key = `${campo}_${formGroupIndex}`;

    if (this.lotesFlatpickrInstances[key]) {
      this.lotesFlatpickrInstances[key].destroy();
    }

    const config: flatpickr.Options.Options = {
      locale: Portuguese,
      enableTime: true,
      time_24hr: true,
      allowInput: true,
      defaultDate: this.lotes.at(formGroupIndex)?.get(campo)?.value,
      onChange: (selectedDates) => {
        const date = selectedDates[0];
        if (date) {
          this.lotes.at(formGroupIndex)?.get(campo)?.setValue(date);
        }
      }
    };

    if (campo === 'dataInicio') {
      config.dateFormat = 'd/m/Y H:i:S';
      config.altFormat = 'd/m/y H:i:S';
      config.enableSeconds = true;
      config.altInput = true;
    } else {
      config.dateFormat = 'Y-m-d H:i';
      config.altFormat = 'd/m/y H:i';
      config.enableSeconds = false;
      config.altInput = true;
      config.altInputClass = 'form-control';
    }

    this.lotesFlatpickrInstances[key] = flatpickr(inputElement, config);
  }

  private formatDateIso(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
  }

  public carregarEvento(): void {
    const eventoIdParam = this.activatedRoute.snapshot.paramMap.get('id');

    if (eventoIdParam !== null && eventoIdParam !== '0') {
      this.estadoSalvar = 'put';
      this.eventoId = +eventoIdParam;

      this.eventoService.getEventoById(this.eventoId).subscribe({
        next: (evento: Evento) => {
          this.evento = { ...evento };
          this.evento.lotes.forEach(lote =>{
            this.lotes.push(this.criarLote(lote));
          });

          this.form.patchValue({
            ...evento,
            dataEvento: evento.dataEvento
              ? new Date(evento.dataEvento)
              : null
          });

          if (this.evento.imagemURL !== '')
          {
            this.imagemURL = environment.apiUrl + 'Resources/Images/' + this.evento.imagemURL;
          }

          this.fp?.setDate(this.form.get('dataEvento')?.value, false);
        },
        error: () => {
          this.toastr.error('Não foi possível carregar o evento.');
        }
      });
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
      imagemURL: [''],
      lotes: this.fb.array([])
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
    setTimeout(() => {
      this.setupLoteDatePickers();
    });
  }

  public salvarLotes(): void {
    if (!this.lotes.valid) {
      this.toastr.warning('Existem lotes inválidos');
      return;
    }

    const lotesParaApi = this.lotes.value.map((lote: any) => {
      let dataInicio = null;
      if (lote.dataInicio) {
        if (lote.dataInicio instanceof Date) {
          dataInicio = this.formatDatePtBr(lote.dataInicio);
        } else {
          try {
            const date = new Date(lote.dataInicio);
            if (!isNaN(date.getTime())) {
              dataInicio = this.formatDatePtBr(date);
            } else {
              dataInicio = lote.dataInicio;
            }
          } catch {
            dataInicio = lote.dataInicio;
          }
        }
      }

      let dataFim = null;
      if (lote.dataFim) {
        if (lote.dataFim instanceof Date) {
          dataFim = this.formatDateIso(lote.dataFim);
        } else {
          try {
            const date = new Date(lote.dataFim);
            if (!isNaN(date.getTime())) {
              dataFim = this.formatDateIso(date);
            } else {
              dataFim = lote.dataFim;
            }
          } catch {
            dataFim = lote.dataFim;
          }
        }
      }

      return {
        id: lote.id,
        nome: lote.nome,
        preco: lote.preco,
        quantidade: lote.quantidade,
        dataInicio: dataInicio,
        dataFim: dataFim,
        eventoId: this.evento.id
      };
    });

    this.loteService
      .saveLote(this.evento.id, lotesParaApi)
      .subscribe({
        next: () => {
          this.toastr.success('Lotes salvos com sucesso!', 'Sucesso!');
        },
        error: (error: any) => {
          console.error('Erro detalhado:', error.error?.errors);
          this.toastr.error('Erro ao tentar salvar lotes.', 'Erro');
        }
      });
  }

  public retornaTituloLote(nome: string): string{
    return nome === null || nome === '' ? 'Nome do lote' : nome;
  }

  criarLote(lote: Lote): FormGroup {
    const formGroup = this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio ? new Date(lote.dataInicio) : null],
      dataFim: [lote.dataFim ? new Date(lote.dataFim) : null]
    });

    setTimeout(() => {
      this.setupLoteDatePickers();
    });

    return formGroup;
  }

  private setupLoteDatePickers(): void {
    setTimeout(() => {
      const loteElements = document.querySelectorAll('[data-lote-index]');

      loteElements.forEach((element) => {
        const index = element.getAttribute('data-lote-index');
        if (index) {
          const dataInicioInput = document.getElementById(`dataInicio_${index}`) as HTMLInputElement;
          const dataFimInput = document.getElementById(`dataFim_${index}`) as HTMLInputElement;

          if (dataInicioInput) {
            this.initLoteDatePicker(dataInicioInput, 'dataInicio', parseInt(index));
          }

          if (dataFimInput) {
            this.initLoteDatePicker(dataFimInput, 'dataFim', parseInt(index));
          }
        }
      });
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

  ngOnDestroy(): void {
    Object.values(this.lotesFlatpickrInstances).forEach(instance => {
      instance.destroy();
    });

    if (this.fp) {
      this.fp.destroy();
    }
  }

  public cssValidator(campoForm: AbstractControl | null): any {
    return campoForm?.invalid && (campoForm?.touched || campoForm?.dirty)
      ? { 'is-invalid': true }
      : {};
  }

  get fg() {
    return this.form.get('lotes') as FormArray;
  }

  public resetForm(): void {
    this.form.reset();
  }

  public salvarAlteracao(): void {
    if (this.form.invalid) return;

    const EventoParaApi = {
      ...this.form.value,
      dataEvento: new Date(this.form.value.dataEvento).toISOString()
    };

    if (this.estadoSalvar === 'post') {
      this.eventoService.postEvento(EventoParaApi).subscribe({
        next: (eventoCriado: Evento) => {
          this.eventoId = eventoCriado.id;

          if (this.file) {
            this.eventoService.postUpload(this.eventoId, this.file).subscribe({
              next: (eventoAtualizado) => {
                this.evento = eventoAtualizado;
                this.imagemURL = environment.apiUrl + 'Resources/Images/' + this.evento.imagemURL;

                this.cdr.detectChanges();

                this.toastr.success('Evento e imagem salvos com sucesso!', 'Sucesso');
                this.router.navigate(['/eventos/detalhe', eventoCriado.id]);
              },
              error: (error) => {
                console.error('Erro no upload:', error);
                this.toastr.warning('Evento criado, mas imagem não foi enviada', 'Atenção');
                this.router.navigate(['/eventos/detalhe', eventoCriado.id]);
              }
            });
          } else {
            this.toastr.success('Evento salvo com sucesso!', 'Sucesso');
            this.router.navigate(['/eventos/detalhe', eventoCriado.id]);
          }
        },
        error: (error) => {
          console.log('ERROS DO BACKEND:', error.error?.errors);
          this.toastr.error('Erro ao salvar', 'Erro');
        }
      });
    } else {
      this.eventoService.putEvento(this.evento.id, EventoParaApi).subscribe({
        next: () => {
          if (this.file) {
            this.eventoService.postUpload(this.evento.id, this.file).subscribe({
              next: (eventoAtualizado) => {
                this.evento = eventoAtualizado;
                this.imagemURL = environment.apiUrl + 'Resources/Images/' + this.evento.imagemURL;

                this.cdr.detectChanges();

                this.toastr.success('Evento e imagem atualizados!', 'Sucesso');
              },
              error: (error) => {
                console.error('Erro no upload:', error);
                this.toastr.warning('Evento atualizado, mas imagem não foi enviada', 'Atenção');
              }
            });
          } else {
            this.toastr.success('Evento atualizado com sucesso!', 'Sucesso');
          }
        },
        error: (error) => {
          console.log('ERROS DO BACKEND:', error.error?.errors);
          this.toastr.error('Erro ao salvar', 'Erro');
        }
      });
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public confirmDeleteLote(): void {
    this.modalRef?.hide();

    this.loteService.deleteLote(this.evento.id, this.loteAtual.id)
      .subscribe({
        next: () => {
          this.toastr.success('Lote deletado com sucesso', 'Sucesso');

          const index = this.lotes.controls.findIndex(
            x => x.value.id === this.loteAtual.id
          );

          if (index !== -1) {
            setTimeout(() => {
              this.lotes.removeAt(index);
              this.cdr.detectChanges();
            });
          }
        },
        error: (error: any) => {
          this.toastr.error(
            `Erro ao tentar deletar o lote ${this.loteAtual.id}`,
            'Erro'
          );
          console.error(error);
        }
      });
  }

  public declineDeleteLote(): void {
    this.modalRef?.hide();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.file = input.files[0];

    this.form.patchValue({
      imagemURL: this.file.name
    });

    this.imagemURL = URL.createObjectURL(this.file);
  }

  uploadImagem(): void {
    if (!this.file) {
      this.toastr.warning('Selecione uma imagem primeiro');
      return;
    }

    this.eventoService
      .postUpload(this.eventoId, this.file)
      .subscribe({
        next: (eventoAtualizado) => {
          this.evento = eventoAtualizado;
          this.imagemURL = environment.apiUrl + 'Resources/Images/' + this.evento.imagemURL;
          this.toastr.success('Imagem atualizada com sucesso!', 'Sucesso!');
        },
        error: (error) => {
          console.error('Erro detalhado:', error);
          this.toastr.error('Erro ao fazer upload da imagem', 'Erro!');
        }
      });
  }
}
