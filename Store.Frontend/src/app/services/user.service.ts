import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUser(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/user/get/${email}`);
  }

  editUser(form: FormGroup) {
    return this.http.post(this.apiUrl + '/api/user/edit', this.getFormData(form));
  }
  
  editUserPass(form: FormGroup) {
    return this.http.post(this.apiUrl + '/api/user/edit/userpass', this.getFormData(form));
  }

  private getFormData(form: FormGroup): FormData {
    const formData: FormData = new FormData();
    Object.keys(form.controls).forEach((key: string) => {
      formData.append(key, form.controls[key].value);
    });
    return formData;
  }
}