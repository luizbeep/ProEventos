import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidatorField } from '../../../util/ValidatorField';
import { AccountService } from '../../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../models/identity/user';

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
  user = {} as User;
  form!: FormGroup;
  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toaster: ToastrService){
    this.validation()

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
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirmePassword: ['', Validators.required],
  }, formOptions);

  }

  register(): void{
    this.user = { ...this.form.value};
    this.accountService.register(this.user).subscribe(
      () => this.router.navigateByUrl('/dashboard'),
      (error: any) => this.toaster.error(error.error)
    )
  }

}
