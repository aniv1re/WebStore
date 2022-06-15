import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { MapItem } from 'src/app/models/mapItem';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-our-location-page',
  templateUrl: './our-location-page.component.html',
  styleUrls: ['./our-location-page.component.css']
})
export class OurLocationPageComponent implements OnInit {
  public locations$: ReplaySubject<MapItem[]> = new ReplaySubject<MapItem[]>();

  constructor(private orderService: OrderService,
    private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - Наши аптеки" ); }

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.orderService.getAllLocations()
    .toPromise()
    .then((data: MapItem[] | undefined) => {
      if (data)
        this.locations$.next(data);
    })
  }
}
