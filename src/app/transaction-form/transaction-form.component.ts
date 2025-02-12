import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../services/transaction.service'; // Importe o serviço

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
  standalone: false
})
export class TransactionFormComponent implements OnChanges {
  @Input() transaction: any;

  transactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService // Injete o serviço
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
      transaction.id = this.transaction?.id || Date.now().toString();

      // Salva a transação usando o serviço
      this.transactionService.addTransaction(transaction);

      // Reseta o formulário
      this.transactionForm.reset({
        type: 'income',
        date: new Date().toISOString().substring(0, 10)
      });
    }
  }
}