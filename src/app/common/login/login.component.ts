import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonService } from 'src/services/common.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
username
password:string
constructor(private toastService: ToastService,
  private commonService: CommonService,
  private httpClient : HttpClient
  ){

}
login(){
  if(this.username!=null && this.password!=null){
    if (this.password.toLowerCase()=='muthyala') {
      this.commonService.authenticate(true,this.username)
    }
  }else if (this.password==null) {
    this.toastService.show("Please enter password",{"className":"danger"})

  }{}
}
githubLogin(){
this.httpClient.post("https://github.com/login/oauth/authorize?client_id=f85c48ec6a7800894aa8&redirect_uri=https://jeethowithjeevan.co.in/#/oauth2","",{headers:{"Accept": "application/json"}}).subscribe(auth_code=>{
  console.log(auth_code);
  alert(JSON.stringify(auth_code))
  this.httpClient.post("https://github.com/login/oauth/access_token","")

})
}
}
