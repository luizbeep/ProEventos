import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidatorField } from '../../../util/ValidatorField';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule

  ],
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss'],
})

export class Registration {
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
  }, formOptions);

  }

}
