import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { IUser } from '../models/user.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<IUser>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentUserObservable() {
    return this.currentUser$;
  }

  getCurrentUser() {
    return this.currentUserSubject.getValue();
  }

  setCurrentUser(user: IUser) {
    this.currentUserSubject.next({ ...user });
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
}
