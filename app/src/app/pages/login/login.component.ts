import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ILoginCreds } from 'src/app/core/dtos/login-creds.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [Validators.required]);

  loginForm = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl,
  });

  loggingIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onLoginClick() {
    let loginCreds: ILoginCreds = {
      email: this.emailFormControl.value,
      password: this.passwordFormControl.value,
    };
    this.loggingIn = true;
    this.authService
      .login(loginCreds)
      .toPromise()
      .then((authData) => {
        this.loggingIn = false;
        this.router.navigateByUrl('/profile');
      })
      .catch((error) => {
        this.snackBar.open(error.error.message, 'error', { duration: 4000 });
        this.loggingIn = false;
      });
  }
}
