import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-news-archive',
  templateUrl: './news-archive.component.html',
  styleUrls: ['./news-archive.component.css']
})
export class NewsArchiveComponent implements OnInit {
  public news$: News[] = [];

  constructor(private newsService: NewsService,
    private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - Архив новостей" ); }

  ngOnInit(): void {
    this.getNews();
  }

  getNews(): void {
    this.newsService.getAllNews()
    .toPromise()
    .then((data: News[] | undefined) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          this.news$.push(data[i]);
        }
      }
    })
  }
}
