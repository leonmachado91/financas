import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'income' | 'expense' | 'debt';
  onAdd: (transaction: { title: string; amount: string; date: string }) => void;
}

export function AddTransactionDialog({ open, onOpenChange, type, onAdd }: AddTransactionDialogProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('pt-BR'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    
    // Simple formatting ensure R$ prefix
    let formattedAmount = amount;
    if (!amount.includes('R$')) {
      formattedAmount = `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`;
    }

    onAdd({ title, amount: formattedAmount, date });
    setTitle('');
    setAmount('');
    onOpenChange(false);
  };

  const titleText = type === 'income' ? 'Nova Receita' : type === 'expense' ? 'Nova Despesa' : 'Nova Dívida';
  const buttonColor = type === 'income' ? 'bg-green-600 hover:bg-green-700' : type === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C1C] border-gray-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os detalhes abaixo para adicionar um novo item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-gray-300">Descrição</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Salário, Conta de Luz"
              className="bg-[#121212] border-gray-700 text-white focus:border-gray-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount" className="text-gray-300">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="bg-[#121212] border-gray-700 text-white focus:border-gray-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-gray-300">Data</Label>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#121212] border-gray-700 text-white focus:border-gray-500"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className={buttonColor}>Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
