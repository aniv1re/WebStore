import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(private title: Title) { this.title.setTitle("Добрая аптека - Каталог лекарственных товаров"); }

  ngOnInit(): void {
  }

}
