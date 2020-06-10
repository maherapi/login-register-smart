import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import {
  Router,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IChangePasswordCreds } from 'src/app/core/dtos/change-password-creds.interface';
import { ISetNewPasswordCreds } from 'src/app/core/dtos/set-new-password-creds.interface';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss'],
})
export class SetNewPasswordComponent implements OnInit {
  token: string;
  newPasswordFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^.{8,15}$/),
  ]);

  changePasswordForm = new FormGroup({
    new_password: this.newPasswordFormControl,
  });

  changingPassword = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getTokenFromUrl();
  }

  onSaveClick() {
    let setNewPassCreds: ISetNewPasswordCreds = {
      reset_token: this.token,
      new_password: this.newPasswordFormControl.value,
    };
    this.changingPassword = true;
    this.userService
      .setNewPassword(setNewPassCreds)
      .toPromise()
      .then((user) => {
        this.snackBar.open('password changed successfully', 'success', {
          duration: 4000,
        });
        this.router.navigateByUrl('/login');
      })
      .catch((error) => {
        this.snackBar.open(error.error.message, 'error', { duration: 4000 });
      })
      .finally(() => (this.changingPassword = false));
  }

  private getTokenFromUrl() {
    this.token = this.route.snapshot.queryParams['reset_token'];
    if (!this.token) {
      this.router.navigateByUrl('/login');
    }
  }
}
