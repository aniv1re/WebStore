import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserExt } from 'src/app/models/userExt';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  public user$: UserExt | undefined;

  constructor(private userService: UserService,
    private actRouter: ActivatedRoute,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private router: Router,
    private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - Редактирование пользователя" );
      if (this.tokenService.token.role != 'Admin')
        this.router.navigateByUrl("");
   }

  editUser = new FormGroup({
    id: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    regDate: new FormControl('', [Validators.required]),
  });

  get editEmail() { return this.editUser.get('email') }
  get getName() { return this.editUser.get('name') }
  get editSurname() { return this.editUser.get('surname') }
  get editPhone() { return this.editUser.get('phone') }
  get editRole() { return this.editUser.get('role') }

  editPassForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get editPassword() { return this.editPassForm.get('password') }
  
  ngOnInit(): void {
    this.actRouter.params.subscribe(
    (data: Params) => {
      let id: number = +data['id']
      this.getUserData(id);
    });
  }

  getUserData(id: number): void {
    this.userService.getUserById(id)
    .toPromise()
    .then((data: UserExt | undefined) => {
      if (data) {
        this.user$ = data;
        this.editUser.setValue({
          id: data.id,
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          email: data.email,
          role: data.role,
          regDate: data.regDate
        });
      }
    })
  }

  saveUserData(): void {
    if (this.editEmail?.value == "" || this.getName?.value == "" || this.editSurname?.value == "" || this.editPhone?.value == "" || this.editRole?.value == "") {
      this.toastr.error('Заполните полe, чтобы продолжить!', 'Изменение пароля', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else {
      this.userService.editUser(this.editUser)
      .toPromise()
      .then(() => {
        this.router.navigateByUrl("/admin/panel").then(() => {
          this.toastr.success('Пользователь успешно изменён!', 'Изменение пароля', {
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
        });
      });
    }
  }

  editPass(): void {
    if (this.editPassword?.value == "") {
      this.toastr.error('Заполните полe, чтобы продолжить!', 'Изменение пароля', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else { 
      this.userService.editUserPass(this.editPassForm).toPromise()
        this.toastr.success('Пароль успешно изменён!', 'Изменение пароля', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
      });
    }
  }
}
