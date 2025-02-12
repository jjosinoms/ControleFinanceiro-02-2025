import { Component, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
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
    MatPaginatorModule
  ],
})
export class TransactionListComponent {
  @Input() set transactions(value: any[]) {
    this.dataSource.data = value;
  }
  @Output() editTransaction = new EventEmitter<any>();
  @Output() deleteTransaction = new EventEmitter<any>();

  displayedColumns: string[] = ['description', 'amount', 'type', 'date', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(transaction: any) {
    this.editTransaction.emit(transaction);
  }

  onDelete(transaction: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Tem certeza que deseja excluir esta transação?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTransaction.emit(transaction.id); // Passa o ID da transação
      }
    });
  }
}