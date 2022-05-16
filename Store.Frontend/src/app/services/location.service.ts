import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public userLocation: string = ""; 

  constructor() {
    let data = localStorage.getItem('location');
    if (data !== null) {
        let parsedData: string = JSON.parse(data);
        this.userLocation = parsedData;
    }
  }

  setUserLocation(location: string): void {
    this.userLocation = location;
    localStorage.setItem('location', JSON.stringify(this.userLocation));
  }

  getUserLocation(): string {
      return this.userLocation;
  }
}