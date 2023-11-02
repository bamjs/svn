import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CommonService } from 'src/services/common.service';

export const loginGuard: CanActivateFn = (route, state) => {
  let activate =false
  const commonService =inject(CommonService)
  commonService.isAuthenticated.subscribe(data=>{
    return data;
  })
  return activate
};
