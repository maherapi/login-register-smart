import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<IUser>(null)
  currentUser$ = this.currentUserSubject.asObservable()

  constructor() { }

  getCurrentUserObservable() {
    return this.currentUser$;
  }

  getCurrentUser() {
    return this.currentUserSubject.getValue()
  }

  setCurrentUser(user: IUser) {
    this.currentUserSubject.next({...user});
  }
}
