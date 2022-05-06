import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { User } from 'src/app/models/user';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public isOrders:boolean = false;
  public ph : string = "";
  public user$: ReplaySubject<User> = new ReplaySubject<User>();

  public passwordInputConfirm: string = "";
  
  constructor(private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
    private toastr: ToastrService,
    private title: Title) { this.title.setTitle("Добрая аптека - Личный кабинет");}

  editUserForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
  });
  
  editPassForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get editPassword() { return this.editPassForm.get('password') }

  get editName() { return this.editUserForm.get('name') }
  get editSurname() { return this.editUserForm.get('surname') }
  get editPhone() { return this.editUserForm.get('phone') }

  @ViewChild('username') passElement: ElementRef | undefined;
  
  editPass(): void {
    this.passwordInputConfirm = (<HTMLInputElement>document.getElementById("pass")).value;

    if (this.editPassword?.value == "" || this.passwordInputConfirm == "") {
      this.toastr.error('Заполните поля ввода, чтобы продолжить!', 'Изменение данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else if (this.editPassword?.value != this.passwordInputConfirm) {
      this.toastr.error('Пароли не совпадают!', 'Изменение данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else { 
      this.userService.editUserPass(this.editPassForm).toPromise()
        this.toastr.success('Пароль успешно изменён!', 'Изменение данных', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
      });
    }
  }

  editUser(): void {
    if (this.editName?.value == '' || this.editSurname?.value == '' || this.editPhone?.value == '') {
      this.toastr.error('Заполните поля ввода, чтобы продолжить!', 'Изменение данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else {
      this.userService.editUser(this.editUserForm).toPromise()
        this.toastr.success('Контактные данные успешно изменены!', 'Изменение данных', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
      });
    }
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.getUser(this.tokenService.token.email).toPromise()
        .then((data: User | undefined) => {
          if (data) {
            this.user$.next(data);
        }
      })

      this.userService.getUser(this.tokenService.token.email).toPromise()
        .then((data: User | undefined) => {
          if (data) {
            this.user$.next(data); 
            this.editUserForm .setValue({
              name: data.name,
              surname: data.surname,
              phone: data.phone,
              email: data.email,
            });
            this.editPassForm .setValue({
              email: data.email,
              password: ''
            });
        }
      })
  }

  logout(): void {
    this.tokenService.remove();
    this.router.navigateByUrl("");
  }

  authU(): void {
    this.isOrders = false;
  }

  orders(): void {
    this.isOrders = true;
  }
}
