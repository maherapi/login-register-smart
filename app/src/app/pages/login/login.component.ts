import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

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
    password: this.passwordFormControl
  })

  loggingIn = false;

  constructor() {}

  ngOnInit(): void {}

  onLoginClick() {
    let loginCreds = {
      email: this.emailFormControl.value,
      password: this.passwordFormControl.value,
    };
    this.loggingIn = true;
    setTimeout(() => {
      this.loggingIn = false;
      console.log(loginCreds);
    }, 3000);
  }
}
