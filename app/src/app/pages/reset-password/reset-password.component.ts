import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  form = new FormGroup({
    email: this.emailFormControl,
  });

  sending = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSendClick() {
    const email: string = this.emailFormControl.value;
    this.sending = true;
    this.userService
      .resetPasswordLink(email)
      .toPromise()
      .then((data) => {
        this.snackBar.open("email sent successfully", 'success', { duration: 4000 });
      })
      .catch((error) => {
        this.snackBar.open(error.error.message, 'error', { duration: 4000 });
      })
      .finally(() => this.sending = false)
  }
}
