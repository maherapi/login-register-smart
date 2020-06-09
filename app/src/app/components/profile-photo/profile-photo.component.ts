import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss'],
})
export class ProfilePhotoComponent implements OnInit {
  private DEFAUL_PATH = '../../../assets/images/accounts/default-avatar.png';
  _path: string;
  @Input() set photoPath(path: string) {
    if (path) {
      this._path = `${env.imgsUrl}/${path}`;
    } else {
      this._path = this.DEFAUL_PATH;
    }
  }
  uploadingImg: boolean = false;
  imgPreviewUrl;
  image: File;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onImageSelect(event: any, template: TemplateRef<any>) {
    const image = event.target.files[0];
    if (!image) return;
    this.image = image;
    const fr = new FileReader();
    fr.onload = () => {
      this.imgPreviewUrl = fr.result;
    };
    fr.readAsDataURL(this.image);
    this.dialog.open(template);
  }

  onImgUploadClick() {
    this.uploadingImg = true;
    this.userService
      .uploadProfilePhoto(this.image)
      .toPromise()
      .then(() => {
        this.snackBar.open('image uploaded successfully', 'success', {
          duration: 4000,
        });
      })
      .catch((error) => {
        this.snackBar.open(error.error.message, 'error', { duration: 4000 });
      })
      .finally(() => {
        this.uploadingImg = false;
      });
  }
}
