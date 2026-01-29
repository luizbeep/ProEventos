import { Component } from '@angular/core';
import { TituloComponent } from '../../shared/titulo/titulo.component';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorField } from '../../util/ValidatorField';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  tituloPagina = 'Perfil';

  form!: FormGroup;
  constructor(public fb: FormBuilder){
    this.validation()

  }

    get f(): any{
    return this.form.controls;
  }


  private validation(): void {

  const formOptions: AbstractControlOptions = {
    validators: ValidatorField.MustMatch('senha', 'confirmeSenha')
  };

  this.form = this.fb.group({
    primeiroNome: ['',
    [Validators.required, Validators.maxLength(15)]],
    ultimoNome: ['',
    [Validators.required, Validators.maxLength(15)]],
    email: ['', [Validators.required, Validators.email]],
    userName: ['',
    [Validators.required, Validators.maxLength(16), Validators.minLength(4)]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmeSenha: ['', Validators.required],
    telefone: ['', Validators.required],
    titulo: ['', Validators.required],
    funcao: ['', Validators.required],
    descricao: ['',
    [Validators.required, Validators.maxLength(125)]],


  }, formOptions);

  }

    onSubmit(): void{
      if(this.form.invalid){
        return;
      }
    }

    public resetForm(): void {
    this.form.reset();
  }

}

