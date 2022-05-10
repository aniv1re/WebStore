import { ChangeDetectionStrategy, Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserToken } from 'src/app/models/userToken';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, DoCheck {
  public loggedUser: string = '';
  public isUserLogged: boolean | undefined;
  public searchText: string | undefined;
  private readonly token: UserToken;
  
  constructor(private tokenService: TokenService,
    private toastr: ToastrService,
    private router: Router) { this.token = tokenService.token; }

  ngOnInit(): void {
    this.isLogged();
    if (localStorage.getItem('token') !== null) {
      this.loggedUser = this.token.email;
    }
  }

  ngDoCheck(): void {
    this.isLogged();
  }

  isLogged(): void {
    if (localStorage.getItem('token') !== null) {
      this.isUserLogged = false;
    }
    else {
      this.isUserLogged = true;
    }
  }

  searchItems(): void {
    this.searchText = (<HTMLInputElement>document.getElementById("searchText")).value;
    if (this.searchText == '' || this.searchText.length < 3) {
      this.toastr.error('Название лекарственного средство должно быть не меньше 3-ёх символов!', 'Поиск', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else {
      this.router.navigateByUrl("search/" + this.searchText).then(() => {
        window.location.reload();
      });
    }
  }

}
