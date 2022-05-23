import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { MapItem } from '../models/mapItem';
import { News } from '../models/news';


@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getLastNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/api/News/get/last/`);
  }
  
  getAllNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/api/News/get/all/`);
  }
}