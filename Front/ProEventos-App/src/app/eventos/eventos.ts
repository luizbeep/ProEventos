import {
  Component,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  afterNextRender
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.scss'],
})
export class Eventos {

  public eventos: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.getEventos();
      }
    });
  }

  getEventos(): void {
    this.http.get<any[]>('http://localhost:5279/api/eventos')
      .subscribe({
        next: response => {
          this.eventos = response;
          this.cdr.detectChanges(); // 🔥 força atualização da view
        },
        error: err => console.error(err)
      });
  }
}
