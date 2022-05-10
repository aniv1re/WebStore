import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public items$: ReplaySubject<Array<Item>> = new ReplaySubject<Array<Item>>();

  constructor(public itemService: ItemService,
    private router: Router,
    private title: Title) { this.title.setTitle("Добрая аптека - Главная" ); }

  ngOnInit(): void {
    this.itemService.getPopularItems().toPromise()
      .then((data: Item[] | undefined) => {
        if (data) {
          this.items$.next(data);
        }
    });
  }

  moveToItem(itemId: number): void {
    this.router.navigateByUrl("catalog/" + itemId);
  }
}
