import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from '../services/transaction.service'; // Importe a interface Transaction

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
  standalone: false
})
export class TransactionFormComponent implements OnChanges {
  @Input() transaction: Transaction | null = null; // Use a interface Transaction
  @Output() transactionSubmit = new EventEmitter<Transaction>(); // EventEmitter para emitir a transação

  transactionForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.transactionForm = this.fb.group({
      id: [null],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^-?\d*(\.\d+)?$/)]],
      type: ['income', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transaction'] && this.transaction) {
      this.transactionForm.patchValue(this.transaction);
    }
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transaction = this.transactionForm.value;

      // Emite o objeto Transaction para o componente pai
      this.transactionSubmit.emit(transaction);

      // Reseta o formulário
      this.transactionForm.reset({
        type: 'income',
        date: new Date().toISOString().substring(0, 10)
      });
    }
  }
}