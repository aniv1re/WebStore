import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {
  public news$: News | undefined;
  public image: File | null = null;

  constructor(private newsService: NewsService,
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService,
    private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - Создание новости" ); 
    if (this.tokenService.token.role != 'Admin')
      this.router.navigateByUrl("");
  }

  createNews = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void { }

  get title() { return this.createNews.get('title') }
  get content() { return this.createNews.get('content') }

  saveNewsData(): void {
    if(this.image) {
      if (this.title?.value == "" || this.content?.value == "") {
        this.toastr.error('Заполните все поля, чтобы продолжить!', 'Создание новости', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
      }
      else {
        this.newsService.createNews(this.createNews, this.image);
        this.router.navigateByUrl("/admin/panel").then(() => {
          this.toastr.success('Новость успешно создана!', 'Создание новости', {
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
        });
      }
    }
    else {
      this.toastr.error('Ошибка загрузки файла!', 'Создание новости', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
  }

  handleFileInput(event: any): void {
  let image = document.querySelector('.file-name')!;
    if(event.target.files[0]) {
      this.image = event.target.files[0];
      image.innerHTML = this.image!.name;
    } else {
      image.innerHTML = '';
    } 
  }
}
