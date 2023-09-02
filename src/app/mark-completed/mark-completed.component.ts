import { Component, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-mark-completed',
  templateUrl: './mark-completed.component.html',
  styleUrls: ['./mark-completed.component.css']
})
export class MarkCompletedComponent {
@Output()
invitation
mapsURL
mapdata
constructor(private activeModal:NgbActiveModal,private sanitizer:DomSanitizer){
  this.updateLocation()
  console.log(this.invitation);

}

sendData(){
  if(!this.invitation.completed ){
    this.updateLocation()
    if(this.mapdata!=null){
      this.invitation.location = this.mapdata
    }else{
      this.invitation.location = { "latitude":null,
      "longitude":null}
    }
  }

  this.activeModal.close(this.invitation)
}
updateForm(invitationevent){
this.invitation.completed = invitationevent.completed;
this.invitation.count = invitationevent.count;
}
updateLocation(){
    // this.mapsURL = `https://maps.google.com/maps?q=${this.positionMap.street}%20${this.positionMap.num}%20%${this.positionMap.city}`;
    if(navigator){
      let mapdata
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        let latitude =position.coords.latitude
        let longitude =position.coords.longitude
        this.mapsURL =`https://maps.google.com/maps?q=loc:${latitude}+${longitude}&z=15&ie=UTF8&iwloc=&output=embed`
       this.mapdata = {
          "latitude":latitude,
          "longitude":longitude
         };
      })
    }else{
  alert("Please accept Geo Location to update")
  return null
    }
  }
}