import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionFormComponent,

    
  ],
  imports: [
    BrowserModule, // ✅ Primeira importação
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatChipsModule,
    NgChartsModule,
    
    ConfirmDialogComponent,
    TransactionListComponent
  ],
  providers: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}