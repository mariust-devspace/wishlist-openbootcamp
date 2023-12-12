import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { IAuthenticated } from '../models/authenticated.model';
import { ILogin } from '../models/login.model';
import { IToken, UserRole } from '../models/token.model';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  _isLoggedIn: boolean | undefined;
  isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn); 
  isLoading$ = new BehaviorSubject<boolean>(false);
  userRole: UserRole | undefined;

  baseURL = `${environment.apiHost}/Account`

  constructor(private httpClient: HttpClient) { 
    if (localStorage.getItem("user_info"))
      this.userRole = JSON.parse(localStorage.getItem("user_info")!).role
  }

  get isLoggedIn(): boolean {
    console.log("isLoggedIn getter");
    if (this._isLoggedIn !== undefined) {
      return this._isLoggedIn as boolean;
    } else{
      if (localStorage.getItem("isLoggedIn")) {
        this._isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")!);
        return this._isLoggedIn as boolean;
      } else {
        return false;
      }
    }
  }

  set isLoggedIn(loginStatus: boolean | undefined) {
    console.log("isLoggedIn setter");
    this._isLoggedIn = loginStatus;
    this.isLoggedIn$.next(loginStatus ?? false);
    localStorage.setItem("isLoggedIn", JSON.stringify(loginStatus));
  }


  logIn(requestBody: ILogin): Observable<IToken> {
    let loginURL = `${this.baseURL}/Login`;
    return this.httpClient.post(loginURL, requestBody) as Observable<IToken>;
  }

  setToken(token: string): Observable<any> {
    console.log("setToken()");
    let setTokenURL = `${this.baseURL}/SetToken`;
    return this.httpClient.post(setTokenURL, {}, { headers: { 'Authorization': "Bearer " + token }}) as Observable<any>;
  }

  checkTokenCookie():  Observable<HttpResponse<IAuthenticated>>{
    console.log("checkTokenCookie()");
    let checkTokenCookieURL = `${this.baseURL}/CheckCookie`;
    const httpOptions = {
      withCredentials: true, 
      secureCookie: false,
      observe: 'response' as 'response'
    };  
    return this.httpClient.get<IAuthenticated>(checkTokenCookieURL, httpOptions) as Observable<HttpResponse<IAuthenticated>>;
  }

  logOut(): Observable<any> {
    let logOutURL = `${this.baseURL}/Logout`;
    const httpOptions = {
      withCredentials: true, 
      secureCookie: false,
      observe: 'response' as 'response'
    };  
    return this.httpClient.post(logOutURL, httpOptions) as Observable<any>
  }
}
