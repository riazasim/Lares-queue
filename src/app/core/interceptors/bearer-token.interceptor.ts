import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, throwError } from 'rxjs';
import { SESSION_TOKEN } from '../constants/auth.constant';
import { BearerTokenService } from '../services/bearer-token.service';
import { environment } from 'src/environments/environment';

export const NO_TOKEN_REQUEST = new HttpContextToken(() => false);

@Injectable({
    providedIn: 'root'
})
export class BearerTokenInterceptor implements HttpInterceptor {

    private readonly authorizationHeaderName = 'Authorization';

    constructor(private readonly tokenService: BearerTokenService,
        private readonly router: Router) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.tokenService.authToken;
        const noTokenRequestFlag = request.context.get(NO_TOKEN_REQUEST);
        if ((typeof token === 'string') && !noTokenRequestFlag) {
            request = request.clone({
                setHeaders: {
                    [this.authorizationHeaderName]: token
                }
            });
        }

        request = request.clone({
            setHeaders: {
                'Transport-Mode': localStorage.getItem("appMode") || ""
            }
        });

        return next.handle(request).pipe(
            catchError((response: any) => {
                if (response.status === 401) {
                    localStorage.clear();
                    document.cookie = `${SESSION_TOKEN}=; Max-Age=0;`;
                    this.router.navigate(['/']);
                }

                return throwError(() => response.error);
            }),
            map(event => {
                if (event instanceof HttpResponse && ([100, 101, 200, 400, 500, 401, 403].includes(event.status))) {

                    if (!environment.production) {
                        console.log('response', event.body);
                    }
                }
                return event;
            }),
        )
    }


}
