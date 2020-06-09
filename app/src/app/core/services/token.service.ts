import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private TOKEN_KEY = 'token';
  constructor() {}

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): string {
    const token: string = localStorage.getItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    return token;
  }
}
