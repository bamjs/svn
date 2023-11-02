import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/services/common.service';
import { MongoDbService } from 'src/services/mongo-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'Srikanth Weds Neelima';
  photo
  // photo = '../assets/single.jpg'
  photos=['../assets/single.jpg','../assets/group_new.jpg','../assets/child.jpg']
  loader$
  isAuthenticated$
  index = 0
  isQr:boolean = false
  constructor(
    private mongoDb:MongoDbService,
    private commonService: CommonService,
    private router:Router
    ){
      this.loader$ = this.commonService.loader
      this.isAuthenticated$ = this.commonService.isAuthenticated;
      // setInterval(()=>{
      //   if (this.index < this.photos.length) {
      //     this.photo = this.photos[this.index++]
      //   }else{
      //     this.index =0
      //   }

      // },2000)
  }
  ngOnInit(): void {
    this.isQrcheck()
  }

  getUsername(){
   return this.commonService.getUsername()
  }
  logout(){
    this.commonService.logout()
  }
  isQrcheck(){
    if (window.location.href.includes("oauth2")) {
      this.isQr= true
      console.log("oauth2",true);
    }
    if(window.location.href.includes("qr")){
      console.log("true,QR");
      this.isQr = true
    //  return true
    }else{
      console.log("false,QR");

      // return false
    }
  }

}
