import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { MapItem } from '../models/mapItem';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getLocations(city: string): Observable<MapItem[]> {
    return this.http.get<MapItem[]>(`${this.apiUrl}/api/Order/get/locations/${city}`);
  }

  getLocationById(id: number): Observable<MapItem> {
    return this.http.get<MapItem>(`${this.apiUrl}/api/Order/get/locationbyid/${id}`);
  }
}