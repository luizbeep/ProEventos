import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    CollapseModule,
    BsDropdownModule
  ],
  templateUrl: './nav.component.html'
})
export class NavComponent {
  isCollapsed = true;

  logout() {
    console.log('logout');
  }
}
