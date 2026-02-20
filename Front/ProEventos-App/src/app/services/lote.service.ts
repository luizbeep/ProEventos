import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lote } from '../models/Lote';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

private readonly baseURL = 'http://localhost:5279/api/lotes';

  constructor(private http: HttpClient) {}

 public getLotesByEventoId(eventoId: number): Observable<Lote[]> {
    return this.http
      .get<Lote[]>(`${this.baseURL}/${eventoId}`)
    }

  public saveLote(eventoId: number, lote: Lote): Observable<Lote> {
    return this.http.put<Lote>(
      `${this.baseURL}/${eventoId}`,
      lote
    );
  }

  public deleteLote(eventoId: number, loteId: number) {
    return this.http.delete(
      `${this.baseURL}/${eventoId}/${loteId}`
    );
  }


}
