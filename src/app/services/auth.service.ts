import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://wd.etsisi.upm.es:10000/users/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ Accept: 'application/json' });
    return this.http.get(this.loginUrl, {
      params: { username, password },
      headers,
      observe: 'response',
    });
  }
}
