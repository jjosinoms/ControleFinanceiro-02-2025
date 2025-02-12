import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionService, Transaction } from './services/transaction.service'; // Importe a interface
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  transactions: Transaction[] = []; // Use a interface Transaction

  // Dados do gráfico
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Receitas',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Despesas',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opções do gráfico
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Transação',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Valor (R$)',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  // Carrega as transações do serviço
  loadTransactions() {
    this.transactionService.getTransactions().subscribe(
      (transactions) => {
        this.transactions = transactions;
        this.updateChart();
      },
      (error) => {
        console.error('Erro ao carregar transações:', error);
      }
    );
  }

  // Adiciona uma nova transação
  onAddTransaction(transaction: Transaction) {
    this.transactionService.createTransaction(transaction).subscribe(
      (newTransaction) => {
        console.log('Transação criada com sucesso:', newTransaction);
        this.loadTransactions(); // Recarrega as transações após adicionar
      },
      (error) => {
        console.error('Erro ao criar transação:', error);
      }
    );
  }

  // Edita uma transação existente
  onEditTransaction(updatedTransaction: Transaction) {
    if (updatedTransaction.id === undefined) {
      console.error('ID da transação não definido');
      return;
    }

    this.transactionService.updateTransaction(updatedTransaction.id, updatedTransaction).subscribe(
      (updated) => {
        console.log('Transação atualizada com sucesso:', updated);
        this.loadTransactions(); // Recarrega as transações após editar
      },
      (error) => {
        console.error('Erro ao atualizar transação:', error);
      }
    );
  }

  // Exclui uma transação
  onDeleteTransaction(transactionId: number) {
    this.transactionService.deleteTransaction(transactionId).subscribe(
      () => {
        console.log('Transação excluída com sucesso');
        this.loadTransactions(); // Recarrega as transações após excluir
      },
      (error) => {
        console.error('Erro ao excluir transação:', error);
      }
    );
  }

  // Atualiza os dados do gráfico
  updateChart() {
    const incomeData = this.transactions
      .filter((t) => t.type === 'income')
      .map((t) => t.amount);
    const expenseData = this.transactions
      .filter((t) => t.type === 'expense')
      .map((t) => t.amount);

    // Atualiza os rótulos do gráfico para usar os nomes das transações
    this.chartData.labels = this.transactions.map((t) => t.description);

    // Atualiza os dados do gráfico
    this.chartData.datasets[0].data = incomeData;
    this.chartData.datasets[1].data = expenseData;

    // Força a atualização do gráfico
    this.chart?.update();
  }

  // Exporta as transações para PDF
  exportToPDF() {
    const doc = new jsPDF();

    // Título do documento
    doc.setFontSize(18);
    doc.text('Relatório de Transações Financeiras', 14, 22);

    // Cabeçalho da tabela
    const headers = [['Descrição', 'Valor (R$)', 'Tipo', 'Data']];

    // Dados da tabela
    const data = this.transactions.map((t) => {
      const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount);
      return [
        t.description,
        amount.toFixed(2),
        t.type === 'income' ? 'Receita' : 'Despesa',
        new Date(t.date).toLocaleDateString('pt-BR'),
      ];
    });

    // Adiciona a tabela ao PDF
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 30,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: 'middle',
        halign: 'center',
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
      },
    });

    // Salva o PDF
    doc.save('transacoes.pdf');
  }

  // Exporta as transações para Excel (CSV)
  exportToCSV() {
    // Cabeçalho da planilha
    const headers = ['Descrição', 'Valor (R$)', 'Tipo', 'Data'];

    // Dados da planilha
    const data = this.transactions.map((t) => {
      const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount);
      return [
        t.description,
        amount.toFixed(2),
        t.type === 'income' ? 'Receita' : 'Despesa',
        new Date(t.date).toLocaleDateString('pt-BR'),
      ];
    });

    // Cria uma planilha
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Ajusta o tamanho das colunas
    const columnWidths = [
      { wch: 40 }, // Descrição
      { wch: 15 }, // Valor
      { wch: 15 }, // Tipo
      { wch: 15 }, // Data
    ];
    worksheet['!cols'] = columnWidths;

    // Cria um workbook e adiciona a planilha
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transações');

    // Salva o arquivo
    XLSX.writeFile(workbook, 'transacoes.xlsx');
  }
}