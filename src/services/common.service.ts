import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  logout() {
    localStorage.clear()
    this.isAuthenticated.next(false)
  }
  loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.checkLocalStorage());

  checkLocalStorage(): boolean {
    if (localStorage.getItem("authenticated")) {
      return true;
    }
    return false;
  }
  getUsername(){
    if (localStorage.getItem("username")) {
      return localStorage.getItem("username")
    }else{
      return "Guest"
    }
  }
  authenticate(bool: boolean,username:string) {
    localStorage.setItem("username",username)
    localStorage.setItem("authenticated", "true")
    this.isAuthenticated.next(true);
  }
  constructor() { }
  loaderShow() {
    this.loader.next(true)
  }
  loaderHide() {
    this.loader.next(false)
  }
}
