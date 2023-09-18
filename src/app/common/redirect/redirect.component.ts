import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MongoDbService } from 'src/services/mongo-db.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {
  constructor(private router: Router, private mongoService: MongoDbService, private http: HttpClient) {
  }
  async ngOnInit() {
    try {
      const collection = await this.mongoService.getCollection("qrStats")
      this.http.get("https://api.ipify.org/?format=json").subscribe(async (data: any) => {
        const inserted = await collection.insertOne({
          timeStamp: Date.now(),
          ip: data.ip
        })
        console.log(inserted);
      })
    } catch (error) {
      console.error("unable ", error);
    } finally {
      window.location.href = "https://maps.app.goo.gl/sefSudawbPJ9cFL78"
    }
  }
}
