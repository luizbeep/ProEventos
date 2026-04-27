import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Evento } from '../models/Evento';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../models/Pagination';

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

public getEventos(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Evento[]>> {
  let params = new HttpParams();

  if (page !== undefined && page !== null && itemsPerPage !== undefined && itemsPerPage !== null) {
    params = params.append('pageNumber', page.toString());
    params = params.append('pageSize', itemsPerPage.toString());
  }

  if(term != null && term != '')
    params = params.append('term', term);

  return this.http
    .get<Evento[]>(this.baseURL, { observe: 'response', params })
    .pipe(
      map(response => {
        const paginatedResult = new PaginatedResult<Evento[]>();

        paginatedResult.result = this.mapEventos(response.body || []);

        if (response.headers.has('Pagination')) {
          const paginationData = JSON.parse(response.headers.get('Pagination') || '');
          // Mapeia os dados da API para a estrutura da classe Pagination
          paginatedResult.pagination.CurrentPage = paginationData.currentPage;
          paginatedResult.pagination.ItemsPerPage = paginationData.itemsPerPage;
          paginatedResult.pagination.TotalItems = paginationData.totalItems;
          paginatedResult.pagination.TotalPages = paginationData.totalPages;
        }

        return paginatedResult;
      })
    );
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
