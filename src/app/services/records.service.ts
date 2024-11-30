import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private apiUrl = 'http://wd.etsisi.upm.es:10000/records';

  constructor(private http: HttpClient) {}

  fetchTopTenScores(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  fetchUserTopTenScores(username: string): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.get<any[]>(`${this.apiUrl}/${username}`, { headers });
  }
}
