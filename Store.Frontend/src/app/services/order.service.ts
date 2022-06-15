import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { MapItem } from '../models/mapItem';
import { Order } from '../models/order';
import { OrderViewModel } from '../models/orderViewModel';
import { StatusState } from '../models/statusState';


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

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/api/Order/get/${id}`);
  }

  getLocationById(id: number): Observable<MapItem> {
    return this.http.get<MapItem>(`${this.apiUrl}/api/Order/get/locationbyid/${id}`);
  }

  editLocation(form: FormGroup) {
    return this.http.post(this.apiUrl + '/api/Order/edit/location', this.getFormData(form));
  }

  editOrderStatus(orderId: number, statusState: StatusState) {
    let headers = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    }
    
    let obj = {
      "id": orderId,
      "status": statusState
    };

    return this.http.post(`${this.apiUrl}/api/Order/edit/status`, JSON.stringify(obj), headers);
  }
  
  createLocation(form: FormGroup) {
    return this.http.post(this.apiUrl + '/api/Order/add/location', this.getFormData(form));
  }
  
  deleteLocationById(id: number) {
    return this.http.post(this.apiUrl + '/api/Order/delete/location', id);
  }

  createNewOrder(order: OrderViewModel): Observable<number> { 
    return this.http.post<number>(`${this.apiUrl}/api/Order/add`, order);
  }

  getUserOrders(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/api/Order/get/user/${id}`);
  }

  deleteOrderById(id: number) {
    return this.http.post(`${this.apiUrl}/api/Order/delete/`, id)
  }

  private getFormData(form: FormGroup): FormData {
    const formData: FormData = new FormData();
    Object.keys(form.controls).forEach((key: string) => {
      formData.append(key, form.controls[key].value);
    });
    return formData;
  }
}