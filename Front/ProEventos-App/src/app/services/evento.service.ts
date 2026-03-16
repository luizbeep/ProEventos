import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Evento } from '../models/Evento';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private readonly baseURL = environment.apiUrl + 'api/eventos';

  constructor(private http: HttpClient) {}


  private mapEvento(evento: Evento): Evento {
    return {
      ...evento,
      dataEvento: evento.dataEvento
        ? new Date(evento.dataEvento)
        : undefined
    };
  }

  private mapEventos(eventos: Evento[]): Evento[] {
    return eventos.map(e => this.mapEvento(e));
  }

 public getEventos(): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(this.baseURL)
      .pipe(map(eventos => this.mapEventos(eventos)));
  }

 public getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(`${this.baseURL}/${tema}/tema`)
      .pipe(map(eventos => this.mapEventos(eventos)));
  }

 public getEventoById(id: number): Observable<Evento> {
    return this.http
      .get<Evento>(`${this.baseURL}/${id}`)
      .pipe(map(evento => this.mapEvento(evento)));
  }

  public postEvento(evento: Evento): Observable<Evento> {

    return this.http
      .post<Evento>(this.baseURL, evento)
      .pipe(map(evento => this.mapEvento(evento)));
  }

 public putEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http
      .put<Evento>(`${this.baseURL}/${id}`, evento)
      .pipe(map(evento => this.mapEvento(evento)));
  }

   public deleteEvento(id: number) {
      return this.http.delete(
        `http://localhost:5279/api/eventos/${id}`,
        { responseType: 'text' }
      );
    }

postUpload(eventoId: number, file: File): Observable<Evento> {

  const formData = new FormData();
  formData.append('file', file);

  return this.http
    .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
    .pipe(
      map(evento => this.mapEvento(evento))
    );
}

}
