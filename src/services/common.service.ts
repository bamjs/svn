import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }
  loaderShow() {
    this.loader.next(true)
  }
  loaderHide() {
    this.loader.next(false)
  }
}
