import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.css']
})
export class NewsPageComponent implements OnInit {
  private routeSub: Subscription | undefined;
  public news$: News | undefined;
  
  constructor(private router: Router,
    private actRouter: ActivatedRoute,
    private newsService: NewsService,
    private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - Просмотр новостей" ); }

  ngOnInit(): void {
    this.routeSub = this.actRouter.params.subscribe(
    (data: Params) => {
      let id: number = +data['id']
      this.getNews(id);
    });
  }

  getNews(id: number): void {
    this.newsService.getNewsById(id)
    .toPromise()
    .then((data: News | undefined) => {
      if (data) {
        this.news$ = data;
      }
    })
  }
}
