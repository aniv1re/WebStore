import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {
  isLogin: boolean = true;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private title: Title) { this.title.setTitle("Добрая аптека - Вход в аккаунт"); }

  ngOnInit(): void {
    if(localStorage.getItem('token') !== null) {
      this.router.navigateByUrl('');
    }
  }

  get regEmail() { return this.registerForm.get('email') }
  get regPassword() { return this.registerForm.get('password') }
  get regName() { return this.registerForm.get('name') }
  get regSurname() { return this.registerForm.get('surname') }
  get regPhone() { return this.registerForm.get('phone') }

  get logEmail() { return this.loginForm.get('email') }
  get logPass() { return this.loginForm.get('password') }

  login(): void {
    if (this.logEmail?.value == '' || this.logPass?.value == '') {
      this.toastr.error('Заполните все поля чтобы продолжить!', 'Вход', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else if (this.logEmail?.errors || this.logPass?.errors) {
      this.toastr.error('Неверно заполнены поля ввода!', 'Вход', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else {
      this.authService.login(this.loginForm).toPromise()
      .then((data: any) => {
        localStorage.setItem('token', data.token);
        this.router.navigateByUrl('');
      }).catch((data: HttpErrorResponse) => {
        if(data.status == 400) {
          this.toastr.error('Неверно указан пароль или email, повторите попытку!', 'Вход', {
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
        }
        else if (data.status == 200){
          this.toastr.success('Вы успешно вошли в аккаунт!', 'Вход', {
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
        }
      });
    }
  }

  register(): void {
    if (this.regEmail?.value == '' || this.regPassword?.value == '' || this.regName?.value == '' || this.regSurname?.value == '' || this.regPhone?.value == '' ) {
      this.toastr.error('Заполните все поля чтобы продолжить!', 'Вход', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else if (this.regEmail?.errors || this.regPassword?.errors || this.regName?.errors || this.regSurname?.errors || this.regPhone?.errors ){
      this.toastr.error('Неверно заполнены поля ввода!', 'Вход', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else {
      this.authService.register(this.registerForm).toPromise().then(() => this.registerForm.reset());

      this.toastr.success('Вы успешно зарегистрировались!', 'Вход', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });

      this.isLogin = !this.isLogin;
    }
    
  }

  tooggle(): void {
    this.isLogin = !this.isLogin;
  }
}
