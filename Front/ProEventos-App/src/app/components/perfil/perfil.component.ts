import { Component } from '@angular/core';
import { TituloComponent } from '../../shared/titulo/titulo.component';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorField } from '../../util/ValidatorField';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { UserUpdate } from '../../models/identity/UserUpdate';

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
  userUpdate = {} as UserUpdate;
  tituloPagina = 'Perfil';

  form!: FormGroup;
  constructor(public fb: FormBuilder,
              public accountService: AccountService,
              private router: Router,
              private toastr: ToastrService,

  ){
    this.validation()
    this.carregarUsuario();

  }

    get f(): any{
    return this.form.controls;
  }


  private validation(): void {

  const formOptions: AbstractControlOptions = {
    validators: ValidatorField.MustMatch('password', 'confirmePassword')
  };


  this.form = this.fb.group({
    primeiroNome: ['',
    [Validators.required, Validators.maxLength(15)]],
    ultimoNome: ['',
    [Validators.required, Validators.maxLength(15)]],
    email: ['', [Validators.required, Validators.email]],
    userName: ['',
    [Validators.required, Validators.maxLength(16), Validators.minLength(4)]],
    password: ['', [Validators.minLength(4), Validators.nullValidator]],
    confirmePassword: ['', Validators.nullValidator],
    phoneNumber: ['', Validators.required],
    titulo: ['NaoInformado', Validators.required],
    funcao: ['NaoInformado', Validators.required],
    descricao: ['',
    [Validators.required, Validators.maxLength(125)]],


  }, formOptions);

  }

    onSubmit(): void{
        this.atualizarUsuario();
      }

      public atualizarUsuario() {
        this.userUpdate = { ...this.form.value };

        this.accountService.updateUser(this.userUpdate).subscribe(
          () => this.toastr.success('Usuário atualizado', 'Sucesso'),
          (error) => {
            console.error("ERRO COMPLETO:", error);
            console.error("VALIDATION:", error.error.errors);
            this.toastr.error('Erro ao atualizar usuário');
          }
        )
        .add()
      }


    public resetForm(): void {
    this.form.reset();
  }

    private carregarUsuario(): void{
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        console.log(userRetorno);
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toastr.success('Usuário Carregado', 'Sucesso');
      },
      (error) => {
        console.error;
        this.toastr.error('Usuário não carregado', 'Erro')
        this.router.navigate(['/dashboard']);
      }
    )
  }

}

