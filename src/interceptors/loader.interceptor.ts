import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { CommonService } from 'src/services/common.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(
    private commonService: CommonService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.commonService.loaderShow()
    console.log("showing loader");
    
    return next.handle(request).pipe(
      finalize(() => { this.commonService.loaderHide() })
    );

  }
}
