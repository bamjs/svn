import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-oauth2',
  templateUrl: './oauth2.component.html',
  styleUrls: ['./oauth2.component.css']
})
export class Oauth2Component implements OnInit {
  constructor(private router:RouterOutlet,
    private commonService:CommonService,
    private http:HttpClient){}
  ngOnInit(): void {
this.router.activatedRoute.queryParamMap.subscribe(data=>{
 let code = data.get("code")
 let access_token = data.get("access_token")
 alert("access_token"+access_token)
 if (access_token) {
alert("acces"+access_token)
this.commonService.isAuthenticated.next(true)
localStorage.setItem("access_token",access_token)
 }else{
  this.http.post("https://github.com/login/oauth/access_token?client_id=f85c48ec6a7800894aa8&client_secret=8f4dea1d06b5b10a40e7bc0c5e67fe5adeb0151f&code"+code+"&redirect_uri=https://jeethowithjeevan.co.in/#/oauth2","").subscribe(data=>{
    console.log(data);

  })

 }
 alert(code)
})
  }

}
