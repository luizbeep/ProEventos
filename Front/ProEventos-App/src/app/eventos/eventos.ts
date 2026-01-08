import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.scss'],
})
export class Eventos implements OnInit {

  public eventos: any[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // ✅ só executa no browser (evita erro com SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.getEventos();
    }
  }

public getEventos(): void {
  this.http.get<any[]>('http://localhost:5279/api/eventos')
    .subscribe({
      next: response => {
        console.log('EVENTOS RECEBIDOS:', response);
        this.eventos = response;
      },
      error: err => console.error('ERRO:', err)
    });
}

}
