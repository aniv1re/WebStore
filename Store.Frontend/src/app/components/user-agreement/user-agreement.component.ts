import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.css']
})
export class UserAgreementComponent implements OnInit {

  constructor(private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - Пользовательское соглашение" ); }

  ngOnInit(): void {
  }

}
