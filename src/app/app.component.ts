import { Component } from '@angular/core';
import { CommonService } from 'src/services/common.service';
import { MongoDbService } from 'src/services/mongo-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Srikanth Weds Neelima';
  photo
  // photo = '../assets/single.jpg'
  photos=['../assets/single.jpg','../assets/group_new.jpg','../assets/child.jpg']
  loader$
  isAuthenticated$
  index = 0
  constructor(
    private mongoDb:MongoDbService,
    private commonService: CommonService
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
  getUsername(){
   return this.commonService.getUsername()
  }
  logout(){
    this.commonService.logout()
  }

}
