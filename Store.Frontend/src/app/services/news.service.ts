import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  getNewsById(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/api/News/get/byid/${id}`)
  }

  createNews(form: FormGroup, image: File) {
    let body = this.getFormData(form);
    body.append('imageFile', image, image.name);
    this.http.post(`${this.apiUrl}/api/News/create`, body).subscribe(
      (data) => { }
    );
  }

  deleteNewsById(id: number) {
    return this.http.post(`${this.apiUrl}/api/News/delete`, id);
  }

  private getFormData(form: FormGroup): FormData {
    const formData: FormData = new FormData();
    Object.keys(form.controls).forEach((key: string) => {
      formData.append(key, form.controls[key].value);
    });
    return formData;
  }
}