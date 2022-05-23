import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { MapItem } from '../models/mapItem';
import { Order } from '../models/order';
import { OrderViewModel } from '../models/orderViewModel';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getLocations(city: string): Observable<MapItem[]> {
    return this.http.get<MapItem[]>(`${this.apiUrl}/api/Order/get/locations/${city}`);
  }
  
  getAllLocations(): Observable<MapItem[]> {
    return this.http.get<MapItem[]>(`${this.apiUrl}/api/Order/get/locations/all`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/api/Order/get/all`);
  }

  getLocationById(id: number): Observable<MapItem> {
    return this.http.get<MapItem>(`${this.apiUrl}/api/Order/get/locationbyid/${id}`);
  }

  createNewOrder(order: OrderViewModel): Observable<number> { 
    return this.http.post<number>(`${this.apiUrl}/api/Order/add`, order);
  }

  getUserOrders(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/api/Order/get/user/${id}`);
  }
}