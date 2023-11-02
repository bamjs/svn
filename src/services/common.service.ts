import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  logout() {
    localStorage.clear()
    this.isAuthenticated.next(this.checkLocalStorage())
  }
  loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.checkLocalStorage());
  checkLocalStorage(): boolean {
    if(window.location.href.includes("qr")){return true}
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
    this.isAuthenticated.subscribe(data=>{
      console.log("authenticated",data);
      
    })
  }
  constructor() { }
  loaderShow() {
    this.loader.next(true)
  }
  loaderHide() {
    this.loader.next(false)
  }
}
