import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Guest } from '../models/guest';
import { GuestExt } from '../models/guestExt';
import { User } from '../models/user';
import { UserExt } from '../models/userExt';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUser(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/user/get/${email}`);
  }
  
  getUserById(id: number): Observable<UserExt> {
    return this.http.get<UserExt>(`${this.apiUrl}/api/user/get/id/${id}`);
  }

  getAllUsers(): Observable<UserExt[]> {
    return this.http.get<UserExt[]>(`${this.apiUrl}/api/user/get/all`);
  }
  
  getAllGuests(): Observable<GuestExt[]> {
    return this.http.get<GuestExt[]>(`${this.apiUrl}/api/user/get/guest/all`);
  }

  getGuest(id: number): Observable<Guest> {
    return this.http.get<Guest>(`${this.apiUrl}/api/user/get/guest/${id}`);
  }

  editUser(form: FormGroup) {
    return this.http.post(this.apiUrl + '/api/user/edit', this.getFormData(form));
  }
  
  editUserPass(form: FormGroup) {
    return this.http.post(this.apiUrl + '/api/user/edit/userpass', this.getFormData(form));
  }
  
  deleteUser(id: number) {
    return this.http.post(this.apiUrl + `/api/user/delete`, id);
  }

  private getFormData(form: FormGroup): FormData {
    const formData: FormData = new FormData();
    Object.keys(form.controls).forEach((key: string) => {
      formData.append(key, form.controls[key].value);
    });
    return formData;
  }
}