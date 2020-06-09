import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

const imports = [
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatDividerModule,
  MatInputModule,
  ReactiveFormsModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatIconModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...imports],
  exports: [...imports],
})
export class SharedModule {}
