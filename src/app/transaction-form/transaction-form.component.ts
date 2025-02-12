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
  
      // Remove a geração manual do ID
      delete transaction.id;
  
      this.transactionService.createTransaction(transaction).subscribe(
        (newTransaction) => {
          console.log('Transação criada com sucesso:', newTransaction);
          this.transactionForm.reset({
            type: 'income',
            date: new Date().toISOString().substring(0, 10)
          });
        },
        (error) => {
          console.error('Erro ao criar transação :', error);
        }
      );
    }
  }
}