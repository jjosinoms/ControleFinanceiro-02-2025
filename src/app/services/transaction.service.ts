import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id?: number; // Opcional, pois o ID é gerado pelo backend
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // Formato: YYYY-MM-DD
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'https://apicontrolefinanceiro.jonz.com.br/transaction';

  constructor(private http: HttpClient) {}

  // Busca todas as transações
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  // Busca uma transação por ID
  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  // Cria uma nova transação
  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  // Atualiza uma transação existente
  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  // Exclui uma transação
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}