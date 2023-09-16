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

}
