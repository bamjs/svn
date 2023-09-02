import { Component } from '@angular/core';
import { CommonService } from 'src/services/common.service';
import { MongoDbService } from 'src/services/mongo-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invite';
  loader$
  constructor(
    private mongoDb:MongoDbService,
    private commonService: CommonService
    ){
      this.loader$ = this.commonService.loader
  }

}
