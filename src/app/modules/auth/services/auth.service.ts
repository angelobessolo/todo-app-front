import { computed, Inject, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { User } from '../interfaces/user';
import { DOCUMENT } from '@angular/common';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { CheckToken } from '../interfaces/check-token.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { Router } from '@angular/router';
import { SignUp } from '../interfaces/sign-up.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );


  public currenUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());


  constructor(@Inject(DOCUMENT) private document: Document) {
    const localStorage = document.defaultView?.localStorage;

    if (localStorage) { 
      this.checkAuthStatus().subscribe();
    }
  }
 
  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of (false);
    }

    const headers = new HttpHeaders().set('Authorization',`Barer ${token}`);

    return this.http.get<CheckToken>(url, { headers} )
      .pipe(
        map(({token, user}) => this.setAuthentication(user, token)),

        // Return Errors
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false)
        })
      )
  }

  login(email: string, password: string): Observable<boolean>{
    const url = `${this.baseUrl}/auth/signIn`;
    const body = {email, password};

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map(res =>{
          const { user, token } = res;

          const userParamsJsonString = JSON.stringify(res);          
          const encodedString = btoa(userParamsJsonString);
          localStorage.setItem('userParams', encodedString);

          this.setAuthentication(user, token);
          return true;
        }),
          

        // Return Errors
        catchError( err =>{
          return throwError(() => err);
        })
        
      );
  }

  signUp(signupForm: any): Observable<any>{
    const url = `${this.baseUrl}/auth`;
   
    const data = {
      email: signupForm.email,
      userName: signupForm.userName,
      password: signupForm.password
    }
    
    return this.http.post<LoginResponse>(url, data)
      .pipe(
        map(res =>{
          return res;
        }),
          
        // Return Errors
        catchError( err =>{
          return throwError(() => err);
        })
        
      );
  }

  private setAuthentication(user: User, token: string): boolean{
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true
  }

  logout(): Observable<boolean> {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );
    return of(true);
  }

}

