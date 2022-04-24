import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  public ph : string = "";
  public user$: ReplaySubject<User> = new ReplaySubject<User>();
  
  constructor(private router: Router, private tokenService: TokenService, private userService: UserService,) { }

  editUserForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  get editPassword() { return this.editUserForm.get('password') }
  get editName() { return this.editUserForm.get('name') }
  get editSurname() { return this.editUserForm.get('surname') }
  get editPhone() { return this.editUserForm.get('phone') }

  editUser(): void {
    // if (this.editPassword != this.editPasswordConfirm) {
    //   console.log("error password confirmation");
    // }
    //else {
      this.userService.editUser(this.editUserForm).toPromise().then(() => this.editUserForm.reset());
      console.log("succes edited");
      this.router.navigateByUrl("/account");
    //}
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
      .catch((data: HttpErrorResponse) => {
        if(data.status === 404) {
          this.router.navigateByUrl("");
        }
      });
  }

  logout(): void {
    this.tokenService.remove();
    this.router.navigateByUrl("");
  }
}
