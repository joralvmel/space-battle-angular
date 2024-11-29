import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private registerUrl = 'http://wd.etsisi.upm.es:10000/users';
  private loginUrl = 'http://wd.etsisi.upm.es:10000/users/login';

  constructor(private http: HttpClient) {}

  registerUser(username: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' });
    const body = new URLSearchParams({ 'username': username, 'email': email, 'password': password });
    return this.http.post(this.registerUrl, body.toString(), { headers, observe: 'response' });
  }

  loginAfterRegister(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Accept': 'application/json' });
    return this.http.get(this.loginUrl, { params: { username, password }, headers, observe: 'response' });
  }
}
