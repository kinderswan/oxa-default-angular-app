import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class AuthInterceptor<T> implements HttpInterceptor {
  constructor() {}

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    const authReq = req.clone({
      headers: req.headers.set('Accept', '*/*'),
    })

    return next.handle(authReq)
  }
}
