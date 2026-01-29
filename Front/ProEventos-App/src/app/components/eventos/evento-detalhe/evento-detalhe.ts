import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-evento-detalhe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evento-detalhe.html',
  styleUrls: ['./evento-detalhe.scss'],
})
export class EventoDetalhe {

  form!: FormGroup;

  get f(): any{
    return this.form.controls;
  }

  constructor(private fb: FormBuilder) {
    this.validation();
  }

  private validation(): void {
    this.form = this.fb.group({
      tema: ['',
        [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      imagemURL: ['', Validators.required]
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

}
