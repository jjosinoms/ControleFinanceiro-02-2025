import { Component, OnInit } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { ChartData, ChartOptions } from 'chart.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit {
  transactions: any[] = [];

  // Dados do gráfico
  chartData: ChartData<'bar'> = {
    labels: [], // Rótulos (datas ou categorias)
    datasets: [
      {
        label: 'Receitas',
        data: [], // Valores das receitas
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo
        borderColor: 'rgba(75, 192, 192, 1)', // Cor da borda
        borderWidth: 1, // Largura da borda
      },
      {
        label: 'Despesas',
        data: [], // Valores das despesas
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Cor de fundo
        borderColor: 'rgba(255, 99, 132, 1)', // Cor da borda
        borderWidth: 1, // Largura da borda
      },
    ],
  };

  // Opções do gráfico
  chartOptions: ChartOptions<'bar'> = {
    responsive: true, // Gráfico responsivo
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Data', // Título do eixo X
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Valor (R$)', // Título do eixo Y
        },
        beginAtZero: true, // Começar o eixo Y do zero
      },
    },
    plugins: {
      legend: {
        display: true, // Exibir a legenda
        position: 'top', // Posição da legenda
      },
      tooltip: {
        enabled: true, // Habilitar tooltips
      },
    },
  };

  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
    this.loadTransactions();

    // Escuta as mudanças no serviço
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
    });

    this.updateChart();
  }

  // Carrega as transações do serviço
  loadTransactions() {
    this.transactions = this.transactionService.getTransactions();
    this.updateChart(); // Atualiza o gráfico após carregar as transações
  }

  // Adiciona uma nova transação
  onAddTransaction(transaction: any) {
    transaction.id = Date.now().toString(); // Adiciona um ID único
    this.transactionService.addTransaction(transaction);
    this.loadTransactions(); // Recarrega as transações
    this.updateChart(); // Atualiza o gráfico
  }

  // Edita uma transação existente
  onEditTransaction(updatedTransaction: any) {
    this.transactionService.updateTransaction(updatedTransaction);
    this.loadTransactions(); // Recarrega as transações
    this.updateChart(); // Atualiza o gráfico
  }

  // Exclui uma transação
  onDeleteTransaction(transactionId: string) {
    this.transactionService.deleteTransaction(transactionId);
    this.loadTransactions(); // Recarrega as transações
    this.updateChart(); // Atualiza o gráfico
  }

  // Atualiza os dados do gráfico
  updateChart() {
    const incomeData = this.transactions.filter((t) => t.type === 'income').map((t) => t.amount);
    const expenseData = this.transactions.filter((t) => t.type === 'expense').map((t) => t.amount);

    // Atualiza os dados do gráfico
    this.chartData.labels = this.transactions.map((t) => t.date);
    this.chartData.datasets[0].data = incomeData;
    this.chartData.datasets[1].data = expenseData;

    // Força a atualização do gráfico
    this.chartData = { ...this.chartData };
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
    const data = this.transactions.map((t) => [
      t.description,
      t.amount.toFixed(2),
      t.type === 'income' ? 'Receita' : 'Despesa',
      new Date(t.date).toLocaleDateString('pt-BR'),
    ]);

    // Adiciona a tabela ao PDF
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 30,
      theme: 'striped', // Estilo da tabela
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: 'middle',
        halign: 'center',
      },
      headStyles: {
        fillColor: [41, 128, 185], // Cor do cabeçalho
        textColor: [255, 255, 255], // Cor do texto do cabeçalho
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
    const data = this.transactions.map((t) => [
      t.description,
      t.amount.toFixed(2),
      t.type === 'income' ? 'Receita' : 'Despesa',
      new Date(t.date).toLocaleDateString('pt-BR'),
    ]);

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