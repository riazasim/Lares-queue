import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupModel } from '../models/signup.model';
import { environment } from 'src/environments/environment';
import { pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { SignInModel } from '../models/signin.model';
import { Observable, of } from 'rxjs';
import { ResponseItemWrapper } from '../models/response-wrappers.types';
import { SESSION_DATA, SESSION_TOKEN } from '../constants/auth.constant';
import { AuthModel } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }

    signup(data: SignupModel): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/signUp`, wrapJsonForRequest(data));
    }

    setPassword(data: { password: string, confirmPassword: string, token: string }): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/setPassword`, wrapJsonForRequest(data), {
            params: {
                token: data.token
            }
        });
    }

    signin(data: SignInModel): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}/api/signIn`, wrapJsonForRequest(data)).pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/forgotPassword`, wrapJsonForRequest({ email }));
    }

    resetPassword(data: { password: string, confirmPassword: string, token: string }): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/resetPassword`, wrapJsonForRequest(data), {
            params: {
                token: data.token
            }
        });
    }

    logout(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/logout`);
    }

    public checkCredentials(): Observable<any> {
        return this.http.get(`${environment.apiUrl}${environment.apiVersion}/checkAPICredentials`);
    }

    saveAuth(data: AuthModel): void {
        sessionStorage.setItem(SESSION_TOKEN, data.token);
        localStorage.setItem(SESSION_DATA, btoa(JSON.stringify(data)));
    }

    getAuth(): AuthModel | null {
        const data = localStorage.getItem(SESSION_DATA);
        if (data) {
            //return JSON.parse(data);
            return JSON.parse(JSON.stringify(data));

        }
        return null;
    }

    removeAuth(): void {
        localStorage.removeItem(SESSION_DATA);
    }
}
