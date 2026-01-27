import { Component } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']

})
export class NavComponent {
  isCollapsed = true;

  constructor(private router: Router) { }

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }
}
