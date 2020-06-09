import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  user$: Observable<IUser>;

  savingChanges: boolean = false;

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

  editForm = new FormGroup({
    firstName: this.firstNameFormControl,
    lastName: this.lastNameFormControl,
    gender: this.genderFormControl,
    email: this.emailFormControl,
    phoneNumber: this.phoneNumberFormControl,
    username: this.usernameFormControl,
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.getUser().pipe(
      tap((user) => {
        this.firstNameFormControl.setValue(user.first_name);
        this.lastNameFormControl.setValue(user.last_name);
        this.genderFormControl.setValue(user.gender);
        this.emailFormControl.setValue(user.email);
        this.phoneNumberFormControl.setValue(user.phone_number);
        this.usernameFormControl.setValue(user.username);
      })
    );
  }

  onSaveClick() {
    const newUser = this.getValuesFromForm();
    this.savingChanges = true;
    this.userService
      .updateUser(newUser)
      .toPromise()
      .then((user) => {
        this.snackBar.open('information updated successfully', 'success', {
          duration: 4000,
        });
        this.router.navigateByUrl('/profile');
      })
      .catch((error) => {
        this.snackBar.open(error.error.message, 'error', {
          duration: 4000,
        });
      })
      .finally(() => {
        this.savingChanges = false;
      })
  }

  onFormChange() {
    this.editForm.valueChanges.subscribe(() => {
      const user: IUser = this.getValuesFromForm();
      this.userService.setCurrentUser({ ...user });
    });
  }

  getValuesFromForm() {
    let editedInfo: IUser = {
      first_name: this.firstNameFormControl.value,
      last_name: this.lastNameFormControl.value,
      gender: this.genderFormControl.value,
      email: this.emailFormControl.value,
      phone_number: this.phoneNumberFormControl.value,
      username: this.usernameFormControl.value,
    };
    return editedInfo;
  }
}
