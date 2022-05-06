import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Item } from 'src/app/models/item';
import { Manufacture } from 'src/app/models/manufacture';
import { Substance } from 'src/app/models/substance';
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
  public substance$: ReplaySubject<Substance> = new ReplaySubject<Substance>();
  public manufacture$: ReplaySubject<Manufacture> = new ReplaySubject<Manufacture>();
  public itemsPopular$: ReplaySubject<Array<Item>> = new ReplaySubject<Array<Item>>();
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

        if (data.substanceId && data.substanceId != null) {
          this.itemService.getSubstanceTitle(data.substanceId).toPromise().then((data: Substance | undefined) => {
            if (data) {
              this.substance$.next(data);
            };
          })
        }

        if (data.manufactureId && data.manufactureId != null) {
          this.itemService.getManufactureTitle(data.manufactureId).toPromise().then((data: Manufacture | undefined) => {
            if (data) {
              this.manufacture$.next(data);
            };
          })
        }

        this.item$.next(data);
      }
    })
    .catch((data: HttpErrorResponse) => {
      if(data.status === 404 || data.status === 204) {
        this.router.navigateByUrl("");
      }
    });

    this.itemService.getPopularSmallItems().toPromise()
      .then((data: Item[] | undefined) => {
        if (data) {
          this.itemsPopular$.next(data);
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

  moveToItem(itemId: number): void {
    this.router.navigateByUrl("catalog/" + itemId);
  }
}
