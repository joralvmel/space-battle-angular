import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
