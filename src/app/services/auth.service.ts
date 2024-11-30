import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://wd.etsisi.upm.es:10000/users/login';
  private recordsUrl = 'http://wd.etsisi.upm.es:10000/records';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ Accept: 'application/json' });
    return this.http.get(this.loginUrl, {
      params: { username, password },
      headers,
      observe: 'response',
    });
  }

  saveRecord(punctuation: number, ufos: number, disposedTime: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    });

    const body = new URLSearchParams();
    body.set('punctuation', punctuation.toString());
    body.set('ufos', ufos.toString());
    body.set('disposedTime', disposedTime.toString());

    return this.http.post(this.recordsUrl, body.toString(), { headers, observe: 'response' });
  }

  isAuthorized(): boolean {
    const token = localStorage.getItem('authToken');
    return token !== null;
  }
}
