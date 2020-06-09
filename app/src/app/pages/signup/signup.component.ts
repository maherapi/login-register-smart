import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ISignupCreds } from 'src/app/core/dtos/signup-creds.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  genderFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/male|female/),
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  phoneNumberFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/(\+9665|05)[0-9]{8}$/),
  ]);
  usernameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-z]{3,15}$/),
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^.{8,15}$/),
  ]);

  signupForm = new FormGroup({
    firstName: this.firstNameFormControl,
    lastName: this.lastNameFormControl,
    gender: this.genderFormControl,
    email: this.emailFormControl,
    phoneNumber: this.phoneNumberFormControl,
    username: this.usernameFormControl,
    password: this.passwordFormControl,
  });

  signingUp = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSignupClick() {
    let signupCreds: ISignupCreds = {
      first_name: this.firstNameFormControl.value,
      last_name: this.lastNameFormControl.value,
      gender: this.genderFormControl.value,
      email: this.emailFormControl.value,
      phone_number: this.phoneNumberFormControl.value,
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
    };
    this.signingUp = true;
    this.authService
      .signup(signupCreds)
      .toPromise()
      .then(() => {
        this.signingUp = false;
        this.router.navigateByUrl('/profile');
      })
      .catch((error) => {
        this.snackBar.open(error.error.message, 'error', { duration: 4000 })
        this.signingUp = false;
      });
  }
}
