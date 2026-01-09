import { Component } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CollapseModule],
  templateUrl: './nav.component.html',
  styleUrls: []
})
export class NavComponent {
  isCollapsed = true;
}
