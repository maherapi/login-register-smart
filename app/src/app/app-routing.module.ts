import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { LoginGuard } from './core/guards/login.guard';
import { NotLoggedInGuard } from './core/guards/not-logged-in.guard';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotLoggedInGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [NotLoggedInGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
