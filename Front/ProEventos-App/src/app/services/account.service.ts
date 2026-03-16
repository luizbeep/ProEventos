import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/identity/user';
import { map, take } from 'rxjs/operators';
import { UserUpdate } from '../models/identity/UserUpdate';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSource = new ReplaySubject<User | null>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  baseUrl = environment.apiUrl + 'api/account/'

  constructor(private http: HttpClient) {
    // Inicializar com o usuário do localStorage se existir
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSource.next(JSON.parse(user));
    }
  }

  public login(model: any): Observable<User>{
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(
      take(1),
      map((response: User) => {
        if (response){
          this.setCurrentUser(response);
        }
        return response;
      })
    );
  }

  getUser(): Observable<UserUpdate>{
    return this.http.get<UserUpdate>(this.baseUrl + 'getUser').pipe(take(1));
  }

  updateUser(model: UserUpdate): Observable<User>{
    return this.http.put<User>(this.baseUrl + 'updateUser', model).pipe(
      take(1),
      map((user: User) => {
        if (user){
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  public register(model: any): Observable<User>{
    return this.http.post<User>(this.baseUrl + 'register', model).pipe(
      take(1),
      map((response: User) => {
        if (response){
          this.setCurrentUser(response);
        }
        return response;
      })
    );
  }

  logout(): void{
    localStorage.removeItem('user');
    this.currentUserSource.next(null); // ← APENAS EMITE NULL
  }

  public setCurrentUser(user: User): void{
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
}
