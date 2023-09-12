import { Injectable } from '@angular/core';
import * as jose from 'jose'
import * as uuid from 'uuid'
@Injectable({
  providedIn: 'root'
})
export class JwtService {
INFO_BAR:string = 'srikanthwebsneelimainvitationcomplete'
uuidout:string='8885469415'
  constructor() { }
async generateToken():Promise<string>{
    const secret = new TextEncoder().encode(
      'srikanthwebsneelimainvitationcomplete',
    )
    const alg = 'HS256'
    if (!this.uuidout) {
      this.uuidout = uuid.v4()
    }else{
      // console.log('UUID already created');

    }


    const jwt =  new jose.SignJWT({ 'urn:example:claim': true})
      .setProtectedHeader({ alg })
      .setAudience('svn-invite-jndfu')
      .setSubject(this.uuidout)
      .setExpirationTime('24h')
      .sign(secret)
  return jwt;
}

}
