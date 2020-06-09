import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ISignupCreds } from '../dtos/signup-creds.interface';
import { ILoginCreds } from '../dtos/login-creds.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment as env } from 'src/environments/environment';
import { IAuthData } from '../dtos/auth-data.interface';
import { UserService } from './user.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus = this.isLoggedInSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  signup(signupCreds: ISignupCreds) {
    return this.http
      .post<IAuthData>(`${env.api}/auth/signup`, signupCreds)
      .pipe(tap((authData) => this.handleAuthData(authData)));
  }

  login(loginCreds: ILoginCreds) {
    return this.http
      .post<IAuthData>(`${env.api}/auth/login`, loginCreds)
      .pipe(tap((authData) => this.handleAuthData(authData)));
  }

  logout() {
    this.tokenService.removeToken();
    localStorage.clear();
    this.isLoggedInSubject.next(false);
    this.router.navigateByUrl('/login');
  }

  getAuthStatusObservable() {
    return this.authStatus;
  }

  getAuthStatus() {
    return this.isLoggedInSubject.getValue();
  }

  private handleAuthData(authData: IAuthData) {
    const { token, user } = authData;
    this.tokenService.setToken(token);
    this.isLoggedInSubject.next(true);
    this.userService.setCurrentUser(user);
  }

  private isLoggedIn() {
    return Boolean(this.tokenService.getToken());
  }
}
