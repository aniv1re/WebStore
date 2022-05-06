import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPopularItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/api/item/get/popular`);
  }
  
  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/api/item/get/${id}`);
  }
  
  getCategoryTitle(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/api/item/get/categorytitle/${id}`);
  }
}