import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      MatCardModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatDatepickerModule,
      MatRadioModule,
      MatIconModule,
      MatChipsModule,
      MatTableModule,
      MatPaginatorModule,
      MatDialogModule 
    ],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}