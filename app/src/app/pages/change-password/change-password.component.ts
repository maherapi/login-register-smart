import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ILoginCreds } from 'src/app/core/dtos/login-creds.interface';
import { IChangePasswordCreds } from 'src/app/core/dtos/change-password-creds.interface';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  oldPasswordFormControl = new FormControl('', [Validators.required]);
  newPasswordFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^.{8,15}$/),
  ]);

  changePasswordForm = new FormGroup({
    email: this.emailFormControl,
    old_password: this.oldPasswordFormControl,
    new_password: this.newPasswordFormControl,
  });

  changingPassword = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSaveClick() {
    let changePassCreds: IChangePasswordCreds = {
      email: this.emailFormControl.value,
      old_password: this.oldPasswordFormControl.value,
      new_password: this.newPasswordFormControl.value,
    };
    this.changingPassword = true;
    this.userService
      .changePassword(changePassCreds)
      .toPromise()
      .then((user) => {
        this.snackBar.open('password changed successfully', 'success', {
          duration: 4000,
        });
        this.router.navigateByUrl('/profile');
      })
      .catch((error) => {
        this.snackBar.open(error.error.message, 'error', { duration: 4000 });
      })
      .finally(() => (this.changingPassword = false));
  }
}
