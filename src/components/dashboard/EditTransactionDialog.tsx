"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { TransactionFormData, transactionSchema } from '@/lib/schemas';
import { paymentMethodsService } from '@/services/paymentMethodsService';
import { PaymentMethod, Transaction } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface EditTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction;
    onSave: (id: string, data: {
        title: string;
        amount: number;
        date: string;
        categoryId: string | null;
        paymentMethodId: string | null;
        profile: 'Leonardo' | 'Flavia' | null;
        isPaid?: boolean;
    }) => Promise<void>;
}

export function EditTransactionDialog({ open, onOpenChange, transaction, onSave }: EditTransactionDialogProps) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Usar hook de categorias com cache
    const { data: categories = [] } = useCategories();

    // Configurar react-hook-form com Zod
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
    });

    const categoryId = watch('categoryId');
    const paymentMethodId = watch('paymentMethodId');
    const profile = watch('profile');
    const isPaid = watch('isPaid');

    useEffect(() => {
        if (open && transaction) {
            // Preencher form com dados da transação
            reset({
                title: transaction.description,
                amount: transaction.amount,
                date: transaction.date,
                categoryId: transaction.category_id || null,
                paymentMethodId: transaction.payment_method_id || null,
                profile: transaction.profile || null,
                isPaid: transaction.status === 'paid',
            });
            loadPaymentMethods();
        }
    }, [open, transaction, reset]);

    const loadPaymentMethods = async () => {
        try {
            const methods = await paymentMethodsService.getAll();
            setPaymentMethods(methods);
        } catch {
            toast.error("Erro ao carregar formas de pagamento");
        }
    };

    const onSubmit = async (data: TransactionFormData) => {
        setIsLoading(true);
        try {
            await onSave(transaction.id, {
                ...data,
                profile: data.profile ?? null,
                isPaid: data.isPaid ?? false,
            });
            onOpenChange(false);
        } catch {
            toast.error("Erro ao atualizar transação");
        } finally {
            setIsLoading(false);
        }
    };

    const isIncome = transaction.type === 'income';
    const buttonColor = isIncome
        ? 'bg-green-600 hover:bg-green-700'
        : 'bg-red-600 hover:bg-red-700';

    // Filtrar categorias pelo tipo
    const filteredCategories = categories.filter(c => c.type === transaction.type);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#1C1C1C] border-gray-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar {isIncome ? 'Receita' : 'Despesa'}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Altere os dados abaixo para atualizar a transação.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-gray-300">Descrição</Label>
                        <Input
                            id="title"
                            {...register('title')}
                            placeholder="Ex: Salário, Conta de Luz"
                            className="bg-[#121212] border-gray-700 text-white focus:border-gray-500"
                            disabled={isLoading}
                        />
                        {errors.title && (
                            <span className="text-red-400 text-sm">{errors.title.message}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount" className="text-gray-300">Valor</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                {...register('amount', { valueAsNumber: true })}
                                placeholder="0,00"
                                className="bg-[#121212] border-gray-700 text-white focus:border-gray-500"
                                disabled={isLoading}
                            />
                            {errors.amount && (
                                <span className="text-red-400 text-sm">{errors.amount.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date" className="text-gray-300">Data</Label>
                            <Input
                                id="date"
                                type="date"
                                {...register('date')}
                                className="bg-[#121212] border-gray-700 text-white focus:border-gray-500"
                                disabled={isLoading}
                            />
                            {errors.date && (
                                <span className="text-red-400 text-sm">{errors.date.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label className="text-gray-300">Categoria</Label>
                            <Select
                                value={categoryId || ''}
                                onValueChange={(val) => setValue('categoryId', val || null)}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="bg-[#121212] border-gray-700 text-white">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1C1C1C] border-gray-800 text-white">
                                    {filteredCategories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-gray-300">Forma de Pagamento</Label>
                            <Select
                                value={paymentMethodId || ''}
                                onValueChange={(val) => setValue('paymentMethodId', val || null)}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="bg-[#121212] border-gray-700 text-white">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1C1C1C] border-gray-800 text-white">
                                    {paymentMethods.map(pm => (
                                        <SelectItem key={pm.id} value={pm.id}>{pm.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-gray-300">Responsável</Label>
                        <Select
                            value={profile || ''}
                            onValueChange={(val) => setValue('profile', val as 'Leonardo' | 'Flavia' | null)}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="bg-[#121212] border-gray-700 text-white">
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1C1C1C] border-gray-800 text-white">
                                <SelectItem value="Leonardo">Leonardo</SelectItem>
                                <SelectItem value="Flavia">Flávia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Checkbox
                            id="isPaidEdit"
                            checked={isPaid}
                            onCheckedChange={(checked) => setValue('isPaid', checked === true)}
                            disabled={isLoading}
                            className="border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                        <Label htmlFor="isPaidEdit" className="text-gray-300 cursor-pointer">
                            Paga
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" className={buttonColor} disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
