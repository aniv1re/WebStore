import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Cart } from '../models/cart';
import { Category } from '../models/category';
import { Item } from '../models/item';
import { Manufacture } from '../models/manufacture';
import { SortState } from '../models/sortState';
import { Substance } from '../models/substance';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPopularItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/api/item/get/popular`);
  }

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/api/item/get/all`);
  }
  
  getPopularSmallItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/api/item/get/popularsmall`);
  }
  
  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/api/item/get/${id}`);
  }
  
  getCategoryTitle(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/api/item/get/categorytitle/${id}`);
  }

  getSubstanceTitle(id: number): Observable<Substance> {
    return this.http.get<Substance>(`${this.apiUrl}/api/item/get/substancetitle/${id}`);
  }
  
  getManufactureTitle(id: number): Observable<Manufacture> {
    return this.http.get<Manufacture>(`${this.apiUrl}/api/item/get/manufacturetitle/${id}`);
  }

  // Search

  getItemsByName(name: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/api/item/get/name/${name}`);
  }
  
  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/api/item/get/${id}`);
  }
  
  getItemsByCategoriesWithFilter(categoryIdValue: number, sortStateValue: SortState) {
    let headers = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    }
    
    let obj = {
      "categoriesId": categoryIdValue,
      "sortState": sortStateValue
    };

    return this.http.post(`${this.apiUrl}/api/Item/get/category`, JSON.stringify(obj), headers);
  }

  createItem(form: FormGroup, image: File) {
    let body = this.getFormData(form);
    body.append('image', image, image.name);
    this.http.post(`${this.apiUrl}/api/Item/add`, body).subscribe(
      (data) => { }
    );
  }

  editItem(form: FormGroup) {
    this.http.post(`${this.apiUrl}/api/Item/edit`, this.getFormData(form)).subscribe(
      (data) => {});
  }

  // decreaseItemStock(itemId: number, count: number) {
  //   let headers = {
  //     headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //     })
  //   }

  //   let obj = {
  //     itemId: itemId,
  //     count: count
  //   }

  //   this.http.post(`${this.apiUrl}/api/Item/decreaseItemStock`, JSON.stringify(obj), headers).subscribe(
  //     (data) => {});
  // }

  incVisitCount(itemId: number) {
    this.http.post(`${this.apiUrl}/api/Item/incVisitCount/`, itemId).subscribe(
      (data) => {});
  }

  deleteItemById(id: number) {
    return this.http.post(`${this.apiUrl}/api/Item/delete/`, id)
  }

  private getFormData(form: FormGroup): FormData {
    const formData: FormData = new FormData();
    Object.keys(form.controls).forEach((key: string) => {
      formData.append(key, form.controls[key].value);
    });
    return formData;
  }
}