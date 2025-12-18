import React, { useState } from 'react';
import { Sidebar } from './components/dashboard/Sidebar';
import { Header } from './components/dashboard/Header';
import { MonthSelector } from './components/dashboard/MonthSelector';
import { TransactionList, TransactionItem } from './components/dashboard/TransactionList';

function parseCurrency(value: string): number {
  // Remove R$, remove dots (thousands separator), replace comma with dot (decimal separator)
  // Example: "R$ 3.500,00" -> "3500.00" -> 3500.00
  return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
}

function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function App() {
  const [lateFilter, setLateFilter] = useState<'payments' | 'debts'>('debts');

  // Late Expenses (Dividas Atrasadas)
  const [lateDebtItems, setLateDebtItems] = useState<TransactionItem[]>([
     { id: '1', title: 'Fatura Nubank', date: '01/01/2025', amount: 'R$ 500,00', type: 'debt' },
     { id: '2', title: 'Aluguel Atrasado', date: '05/01/2025', amount: 'R$ 1.200,00', type: 'debt' }
  ]);

  // Late Incomes (Pagamentos Atrasados a Receber)
  const [latePaymentItems, setLatePaymentItems] = useState<TransactionItem[]>([
     { id: '3', title: 'Reembolso Pendente', date: '15/01/2025', amount: 'R$ 200,00', type: 'income' }
  ]);

  // Regular Income
  const [incomeItems, setIncomeItems] = useState<TransactionItem[]>([
    { id: '1', title: 'Salário', date: '01/02/2025', amount: 'R$ 3.500,00', type: 'income' },
    { id: '2', title: 'Freelance', date: '05/02/2025', amount: 'R$ 800,00', type: 'income' },
    { id: '3', title: 'Dividendos', date: '10/02/2025', amount: 'R$ 150,00', type: 'income' },
  ]);

  // Regular Expense
  const [expenseItems, setExpenseItems] = useState<TransactionItem[]>([
    { id: '1', title: 'Mercado', date: '02/02/2025', amount: 'R$ 450,00', type: 'expense' },
    { id: '2', title: 'Gasolina', date: '03/02/2025', amount: 'R$ 200,00', type: 'expense' },
  ]);

  const calculateTotal = (items: TransactionItem[]) => {
    const total = items.reduce((acc, item) => acc + parseCurrency(item.amount), 0);
    return formatCurrency(total);
  };

  const handleAddLateDebt = (data: { title: string, amount: string, date: string }) => {
    const newItem: TransactionItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      type: 'debt'
    };
    setLateDebtItems([...lateDebtItems, newItem]);
  };

  const handleAddLatePayment = (data: { title: string, amount: string, date: string }) => {
    const newItem: TransactionItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      type: 'income'
    };
    setLatePaymentItems([...latePaymentItems, newItem]);
  };

  const handleAddIncome = (data: { title: string, amount: string, date: string }) => {
    const newItem: TransactionItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      type: 'income'
    };
    setIncomeItems([...incomeItems, newItem]);
  };

  const handleAddExpense = (data: { title: string, amount: string, date: string }) => {
    const newItem: TransactionItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      type: 'expense'
    };
    setExpenseItems([...expenseItems, newItem]);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-green-500/30">
      <Sidebar />
      
      <div className="pl-20 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col gap-8 pt-[0px] pr-[32px] pb-[32px] pl-[32px]">
          {/* Top Section: Month Carousel */}
          <section>
            <MonthSelector />
          </section>

          {/* Middle Section: Late Payments / Debts Selector */}
          <section>
            <TransactionList 
              title={lateFilter === 'debts' ? "Dívidas Atrasadas" : "Pagamentos Atrasados"}
              total={lateFilter === 'debts' ? calculateTotal(lateDebtItems) : calculateTotal(latePaymentItems)}
              variant="debt" // Keep orange/red styling for "Late" items generally, or we could switch variant based on filter
              items={lateFilter === 'debts' ? lateDebtItems : latePaymentItems}
              collapsible={false}
              filterOptions={[
                { label: 'Dívidas Atrasadas', value: 'debts' },
                { label: 'Pagamentos Atrasados', value: 'payments' }
              ]}
              currentFilter={lateFilter}
              onFilterChange={(val) => setLateFilter(val as 'payments' | 'debts')}
              onAddTransaction={lateFilter === 'debts' ? handleAddLateDebt : handleAddLatePayment}
            />
          </section>

          {/* Bottom Section: Income and Expenses */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TransactionList 
              title="Receitas" 
              total={calculateTotal(incomeItems)}
              variant="income"
              items={incomeItems}
              onAddTransaction={handleAddIncome}
            />
            
            <TransactionList 
              title="Despesas" 
              total={calculateTotal(expenseItems)}
              variant="expense"
              items={expenseItems}
              onAddTransaction={handleAddExpense}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
