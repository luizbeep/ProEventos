import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink

  ],
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss'],
})
export class Registration {}
