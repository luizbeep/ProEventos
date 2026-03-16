import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserLogin } from '../../../models/identity/UserLogin';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  model = {} as UserLogin;

  constructor(private accountService: AccountService,
              private router: Router,
              private toaster: ToastrService) {}

  public login(): void{
    this.accountService.login(this.model).subscribe(
      () => {this.router.navigateByUrl('/dashboard');},
      (error: any) => {
        if (error.status == 401)
          this.toaster.error('usuário ou senha inválidos')
        else
          console.error(error);
      }
    )
  }
}
