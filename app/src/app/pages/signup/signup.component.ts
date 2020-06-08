import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  genderFormControl = new FormControl('', [Validators.required, Validators.pattern(/male|female/)]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  phoneNumberFormControl = new FormControl('', [Validators.required, Validators.pattern(/(\+9665|05)[0-9]{8}$/)]);
  usernameFormControl = new FormControl('', [Validators.required, Validators.pattern(/^[a-z]{3,15}$/)]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.pattern(/^.{8,15}$/)]);

  signupForm = new FormGroup({
    firstName: this.firstNameFormControl,
    lastName: this.lastNameFormControl,
    gender: this.genderFormControl,
    email: this.emailFormControl,
    phoneNumber: this.phoneNumberFormControl,
    username: this.usernameFormControl,
    password: this.passwordFormControl
  });

  signingUp = false;

  constructor() {}

  ngOnInit(): void {}

  onSignupClick() {
    let signupCreds = {
      first_name: this.firstNameFormControl.value,
      last_name: this.lastNameFormControl.value,
      gender: this.genderFormControl.value,
      email: this.emailFormControl.value,
      phone_number: this.phoneNumberFormControl.value,
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value
    };
    this.signingUp = true;
    setTimeout(() => {
      this.signingUp = false;
      console.log(signupCreds);
    }, 3000);
  }
}
