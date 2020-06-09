import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user$: Observable<IUser>;
  loading: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loading = true;
    this.userService
      .getUser()
      .toPromise()
      .then(
        (user) => (this.user$ = this.userService.getCurrentUserObservable())
      )
      .finally(() => (this.loading = false));
  }
}
