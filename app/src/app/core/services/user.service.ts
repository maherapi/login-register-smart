import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { IUser } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { IChangePasswordCreds } from '../dtos/change-password-creds.interface';
import { ISetNewPasswordCreds } from '../dtos/set-new-password-creds.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<IUser>({});

  constructor(private http: HttpClient) {}

  getCurrentUserObservable() {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser() {
    return this.currentUserSubject.getValue();
  }

  setCurrentUser(user: IUser) {
    const prevUser = this.getCurrentUser();
    this.currentUserSubject.next({ ...prevUser, ...user });
  }

  getUser() {
    return this.http
      .get<IUser>(`${env.api}/user`)
      .pipe(tap((user) => this.setCurrentUser(user)));
  }

  updateUser(newUser: IUser) {
    return this.http
      .put<IUser>(`${env.api}/user`, newUser)
      .pipe(tap((user) => this.setCurrentUser(user)));
  }

  uploadProfilePhoto(photo: File) {
    let formData = new FormData();
    formData.append('profile_photo', photo);
    return this.http
      .post<IUser>(`${env.api}/user/photo`, formData)
      .pipe(tap((user) => this.setCurrentUser(user)));
  }

  changePassword(changePassCreds: IChangePasswordCreds) {
    return this.http
      .post<IUser>(`${env.api}/auth/password`, changePassCreds)
      .pipe(tap((user) => this.setCurrentUser(user)));
  }

  resetPasswordLink(email: string) {
    return this.http
      .post<any>(`${env.api}/auth/password/resetlink`, { email })
      .pipe(
        tap((data) =>
          console.log(
            `${env.url}/set-new-password?reset_token=${data.reset_token}`
          )
        )
      );
  }

  setNewPassword(setNewPassCreds: ISetNewPasswordCreds) {
    return this.http
      .post<IUser>(`${env.api}/auth/password/reset`, setNewPassCreds)
      .pipe(
        tap((user) => {
          console.log(user);
          this.setCurrentUser(user);
        })
      );
  }
}
