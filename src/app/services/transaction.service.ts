import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly STORAGE_KEY = 'transactions';
  private transactionsSubject = new BehaviorSubject<any[]>(this.getTransactions());

  transactions$ = this.transactionsSubject.asObservable();

  constructor() {}

  saveTransactions(transactions: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    this.transactionsSubject.next(transactions); // Notifica os componentes sobre a mudança
  }

  getTransactions(): any[] {
    const transactions = localStorage.getItem(this.STORAGE_KEY);
    return transactions ? JSON.parse(transactions) : [];
  }

  addTransaction(transaction: any): void {
    const transactions = this.getTransactions();

    // Verifica se a transação já existe (evita duplicação)
    const existingTransaction = transactions.find(t => t.id === transaction.id);
    if (!existingTransaction) {
      transactions.push(transaction);
      this.saveTransactions(transactions);
    }
  }

  updateTransaction(updatedTransaction: any): void {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
      transactions[index] = updatedTransaction;
      this.saveTransactions(transactions);
    }
  }

  deleteTransaction(transactionId: string): void {
    const transactions = this.getTransactions().filter(t => t.id !== transactionId);
    this.saveTransactions(transactions);
  }
}