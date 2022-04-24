import { ChangeDetectionStrategy, Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { UserToken } from 'src/app/models/userToken';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, DoCheck {
  public email: string = '';
  public isUserLogged: boolean | undefined;
  private readonly token: UserToken;
  
  constructor(private tokenService: TokenService) { this.token = tokenService.token; }

  ngOnInit(): void {
    this.isLogged();
    if (localStorage.getItem('token') !== null) {
      this.email = this.token.email;
    }
    
  }

  // 
  ngDoCheck(): void {
    this.isLogged();
    if (localStorage.getItem('token') !== null) {
      this.email = this.token.email;
    }
  }

  isLogged(): void {
    if (localStorage.getItem('token') !== null) {
      this.isUserLogged = false;
    }
    else {
      this.isUserLogged = true;
    }
  }

}
