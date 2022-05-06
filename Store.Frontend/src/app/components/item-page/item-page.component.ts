import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit {
  public item$: ReplaySubject<Item> = new ReplaySubject<Item>();
  public itemId: number = 0;
  public count: number = 1;
  public category$: ReplaySubject<Category> = new ReplaySubject<Category>();
  private routeSub: Subscription | undefined;

  constructor(private router: Router,
    private actRouter: ActivatedRoute,
    public itemService: ItemService,) { }

  ngOnInit(): void {
    this.routeSub = this.actRouter.params.subscribe(
      (data: Params) => {
        let id: number = +data['id']

        this.itemId = id;
        this.getItem();
      });
  }
  //getCategoryTitle this.category$ = 

  getItem(): void {
    this.itemService.getItem(this.itemId).toPromise()
    .then((data: Item | undefined) => {
      if (data) {
        if (data.categoryId) {
          this.itemService.getCategoryTitle(data.categoryId).toPromise().then((data: Category | undefined) => {
            if (data) {
              this.category$.next(data);
            };
          })
        }
        this.item$.next(data);
      }
    })
    .catch((data: HttpErrorResponse) => {
      if(data.status === 404) {
        this.router.navigateByUrl("");
      }
    });
  }

  addCount(): void {
    this.count++;
  }

  reduceCount(): void {
    if (this.count > 1) {
      this.count--;
    }
  }
}
