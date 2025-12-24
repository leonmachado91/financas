"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { format, parse } from 'date-fns';
import { Loader2, TrendingDown, TrendingUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Drawer } from 'vaul';

interface TransactionSheetProps {
    /** Se o sheet está aberto */
    open: boolean;
    /** Callback ao mudar estado de abertura */
    onOpenChange: (open: boolean) => void;
    /** Tipo de transação */
    type?: 'income' | 'expense' | 'debt';
    /** Modo de edição */
    mode?: 'add' | 'edit';
    /** Dados iniciais para edição */
    initialData?: {
        description?: string;
        amount?: number;
        date?: string;
        categoryId?: string | null;
        paymentMethodId?: string | null;
        profile?: string | null;
        isPaid?: boolean;
    };
    /** Categorias disponíveis */
    categories?: Array<{ id: string; name: string; type: string }>;
    /** Formas de pagamento disponíveis */
    paymentMethods?: Array<{ id: string; name: string }>;
    /** Callback ao salvar */
    onSave?: (data: {
        description: string;
        amount: number;
        date: string;
        categoryId: string | null;
        paymentMethodId: string | null;
        profile: 'Leonardo' | 'Flavia' | null;
        isPaid: boolean;
    }) => Promise<void>;
    /** Se está salvando */
    isLoading?: boolean;
}

const typeConfig = {
    income: {
        title: 'Nova Receita',
        editTitle: 'Editar Receita',
        color: 'var(--accent-success)',
        gradient: 'var(--gradient-success)',
    },
    expense: {
        title: 'Nova Despesa',
        editTitle: 'Editar Despesa',
        color: 'var(--accent-danger)',
        gradient: 'var(--gradient-danger)',
    },
    debt: {
        title: 'Nova Dívida',
        editTitle: 'Editar Dívida',
        color: 'var(--accent-warning)',
        gradient: 'var(--gradient-warning)',
    },
};

/**
 * TransactionSheet - Modal/Drawer para adicionar/editar transações
 * 
 * - Mobile: Usa Drawer (vaul) com comportamento de arrastar
 * - Desktop: Usa Dialog (radix) centralizado
 */
export function TransactionSheet({
    open,
    onOpenChange,
    type = 'expense',
    mode = 'add',
    initialData,
    categories = [],
    paymentMethods = [],
    onSave,
    isLoading = false,
}: TransactionSheetProps) {
    const isMobile = useIsMobile();
    const config = typeConfig[type];
    const title = mode === 'add' ? config.title : config.editTitle;

    // Form state
    const [description, setDescription] = useState(initialData?.description || '');
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
    const [date, setDate] = useState(initialData?.date || format(new Date(), 'yyyy-MM-dd'));
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
    const [paymentMethodId, setPaymentMethodId] = useState(initialData?.paymentMethodId || '');
    const [profile, setProfile] = useState<'Leonardo' | 'Flavia' | ''>((initialData?.profile as 'Leonardo' | 'Flavia') || '');
    const [isPaid, setIsPaid] = useState(initialData?.isPaid || false);

    // Reset form quando abre/fecha
    useEffect(() => {
        if (open && initialData) {
            setDescription(initialData.description || '');
            setAmount(initialData.amount?.toString() || '');
            setDate(initialData.date || format(new Date(), 'yyyy-MM-dd'));
            setCategoryId(initialData.categoryId || '');
            setPaymentMethodId(initialData.paymentMethodId || '');
            setProfile((initialData.profile as 'Leonardo' | 'Flavia') || '');
            setIsPaid(initialData.isPaid || false);
        } else if (!open) {
            // Reset ao fechar
            setDescription('');
            setAmount('');
            setDate(format(new Date(), 'yyyy-MM-dd'));
            setCategoryId('');
            setPaymentMethodId('');
            setProfile('');
            setIsPaid(false);
        }
    }, [open, initialData]);

    const handleSubmit = async () => {
        if (!description.trim() || !amount) return;

        await onSave?.({
            description: description.trim(),
            amount: parseFloat(amount.replace(',', '.')),
            date,
            categoryId: categoryId || null,
            paymentMethodId: paymentMethodId || null,
            profile: profile || null,
            isPaid,
        });

        onOpenChange(false);
    };

    const filteredCategories = categories.filter(
        (cat) => type === 'income' ? cat.type === 'income' : cat.type === 'expense'
    );

    // Componente de formulário compartilhado
    const FormContent = () => (
        <div className="space-y-5">
            {/* Valor */}
            <div className="space-y-2">
                <Label style={{ color: 'var(--text-secondary)' }}>Valor</Label>
                <div className="relative">
                    <span
                        className="absolute left-4 top-1/2 -translate-y-1/2 font-medium"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        R$
                    </span>
                    <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0,00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-12 text-2xl font-bold h-14"
                        style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)',
                        }}
                    />
                </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
                <Label style={{ color: 'var(--text-secondary)' }}>Descrição</Label>
                <Input
                    type="text"
                    placeholder="Ex: Mercado, Salário..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)',
                    }}
                />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
                <Label style={{ color: 'var(--text-secondary)' }}>Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger
                        style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)',
                        }}
                    >
                        <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent
                        style={{
                            backgroundColor: 'var(--bg-elevated)',
                            borderColor: 'var(--border-subtle)',
                        }}
                    >
                        {filteredCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Data - DatePicker Customizado */}
            <div className="space-y-2">
                <Label style={{ color: 'var(--text-secondary)' }}>Data</Label>
                <DatePicker
                    value={date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined}
                    onChange={(selectedDate) => {
                        setDate(format(selectedDate, 'yyyy-MM-dd'));
                    }}
                    placeholder="Selecionar data"
                />
            </div>

            {/* Responsável */}
            <div className="space-y-2">
                <Label style={{ color: 'var(--text-secondary)' }}>Responsável</Label>
                <Select value={profile} onValueChange={(v) => setProfile(v as typeof profile)}>
                    <SelectTrigger
                        style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)',
                        }}
                    >
                        <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent
                        style={{
                            backgroundColor: 'var(--bg-elevated)',
                            borderColor: 'var(--border-subtle)',
                        }}
                    >
                        <SelectItem value="Leonardo">Leonardo</SelectItem>
                        <SelectItem value="Flavia">Flávia</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Forma de Pagamento */}
            {paymentMethods.length > 0 && (
                <div className="space-y-2">
                    <Label style={{ color: 'var(--text-secondary)' }}>Forma de Pagamento</Label>
                    <Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
                        <SelectTrigger
                            style={{
                                backgroundColor: 'var(--bg-tertiary)',
                                borderColor: 'var(--border-subtle)',
                                color: 'var(--text-primary)',
                            }}
                        >
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent
                            style={{
                                backgroundColor: 'var(--bg-elevated)',
                                borderColor: 'var(--border-subtle)',
                            }}
                        >
                            {paymentMethods.map((pm) => (
                                <SelectItem key={pm.id} value={pm.id}>
                                    {pm.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Já foi paga */}
            <div className="flex items-center gap-3 pt-2">
                <Checkbox
                    id="isPaid"
                    checked={isPaid}
                    onCheckedChange={(checked) => setIsPaid(checked === true)}
                    style={{
                        borderColor: 'var(--border-medium)',
                    }}
                />
                <Label
                    htmlFor="isPaid"
                    className="cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    {type === 'income' ? 'Já recebido' : 'Já foi paga'}
                </Label>
            </div>

            {/* Botão Salvar */}
            <Button
                onClick={handleSubmit}
                disabled={isLoading || !description.trim() || !amount}
                className="w-full h-12 text-base font-semibold rounded-xl"
                style={{
                    background: config.gradient,
                    color: 'white',
                }}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    mode === 'add' ? 'Adicionar' : 'Salvar'
                )}
            </Button>
        </div>
    );

    // === DESKTOP: Dialog centralizado - layout compacto SEM scroll ===
    if (!isMobile) {
        const TypeIcon = type === 'income' ? TrendingUp : TrendingDown;

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    className="max-w-xl rounded-3xl p-0 overflow-hidden border-0 shadow-2xl"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                    }}
                >
                    {/* === HERO: Valor como destaque principal === */}
                    <div
                        className="relative px-8 py-8"
                        style={{
                            background: type === 'income'
                                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.03) 100%)'
                                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.03) 100%)',
                        }}
                    >
                        {/* Decorative circles */}
                        <div
                            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
                            style={{ backgroundColor: config.color }}
                        />
                        <div
                            className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full opacity-5"
                            style={{ backgroundColor: config.color }}
                        />

                        <DialogHeader className="relative z-10 space-y-0">
                            {/* Título inline com ícone */}
                            <div className="flex items-center gap-3 mb-6">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{
                                        backgroundColor: type === 'income'
                                            ? 'var(--accent-success-bg)'
                                            : 'var(--accent-danger-bg)',
                                    }}
                                >
                                    <TypeIcon
                                        className="w-5 h-5"
                                        style={{ color: config.color }}
                                    />
                                </div>
                                <DialogTitle
                                    className="text-lg font-semibold"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    {title}
                                </DialogTitle>
                            </div>
                            <DialogDescription className="sr-only">
                                Formulário para {mode === 'add' ? 'adicionar nova' : 'editar'} transação
                            </DialogDescription>

                            {/* VALOR HERO - Extra grande */}
                            <div className="flex items-baseline gap-2">
                                <span
                                    className="text-3xl font-bold"
                                    style={{ color: config.color }}
                                >
                                    R$
                                </span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0,00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-transparent border-none outline-none text-6xl font-black tracking-tight w-full"
                                    style={{ color: config.color }}
                                />
                            </div>
                        </DialogHeader>
                    </div>

                    {/* === FORM: Layout compacto === */}
                    <div className="px-8 py-6 space-y-4">
                        {/* Descrição - campo principal */}
                        <Input
                            type="text"
                            placeholder="Descrição (ex: Mercado, Salário...)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-12 rounded-xl text-base"
                            style={{
                                backgroundColor: 'var(--bg-tertiary)',
                                borderColor: 'var(--border-subtle)',
                                color: 'var(--text-primary)',
                            }}
                        />

                        {/* Grid 2 colunas: Categoria e Data */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Categoria */}
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger
                                    className="h-10 rounded-lg text-sm"
                                    style={{
                                        backgroundColor: 'var(--bg-tertiary)',
                                        borderColor: 'var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent
                                    style={{
                                        backgroundColor: 'var(--bg-elevated)',
                                        borderColor: 'var(--border-subtle)',
                                    }}
                                >
                                    {filteredCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Data - DatePicker Customizado */}
                            <DatePicker
                                value={date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined}
                                onChange={(selectedDate) => {
                                    setDate(format(selectedDate, 'yyyy-MM-dd'));
                                }}
                                placeholder="Data"
                            />
                        </div>

                        {/* Grid 2 colunas: Responsável e Pagamento/Status */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Responsável */}
                            <Select value={profile} onValueChange={(v) => setProfile(v as typeof profile)}>
                                <SelectTrigger
                                    className="h-10 rounded-lg text-sm"
                                    style={{
                                        backgroundColor: 'var(--bg-tertiary)',
                                        borderColor: 'var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    <SelectValue placeholder="Responsável" />
                                </SelectTrigger>
                                <SelectContent
                                    style={{
                                        backgroundColor: 'var(--bg-elevated)',
                                        borderColor: 'var(--border-subtle)',
                                    }}
                                >
                                    <SelectItem value="Leonardo">Leonardo</SelectItem>
                                    <SelectItem value="Flavia">Flávia</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Forma de Pagamento OU Botão Status */}
                            {paymentMethods.length > 0 ? (
                                <Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
                                    <SelectTrigger
                                        className="h-10 rounded-lg text-sm"
                                        style={{
                                            backgroundColor: 'var(--bg-tertiary)',
                                            borderColor: 'var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                        }}
                                    >
                                        <SelectValue placeholder="Pagamento" />
                                    </SelectTrigger>
                                    <SelectContent
                                        style={{
                                            backgroundColor: 'var(--bg-elevated)',
                                            borderColor: 'var(--border-subtle)',
                                        }}
                                    >
                                        {paymentMethods.map((pm) => (
                                            <SelectItem key={pm.id} value={pm.id}>
                                                {pm.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsPaid(!isPaid)}
                                    className="h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                    style={{
                                        backgroundColor: isPaid ? 'var(--accent-success-bg)' : 'var(--bg-tertiary)',
                                        color: isPaid ? 'var(--accent-success)' : 'var(--text-secondary)',
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        borderColor: isPaid ? 'var(--accent-success)' : 'var(--border-subtle)',
                                    }}
                                >
                                    {isPaid ? '✓ Pago' : 'Marcar como pago'}
                                </button>
                            )}
                        </div>

                        {/* Checkbox se tiver payment methods (mostra separado) */}
                        {paymentMethods.length > 0 && (
                            <label
                                className="flex items-center gap-3 cursor-pointer"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <Checkbox
                                    checked={isPaid}
                                    onCheckedChange={(checked) => setIsPaid(checked === true)}
                                    className="data-[state=checked]:bg-[var(--accent-success)] data-[state=checked]:border-[var(--accent-success)]"
                                />
                                <span className="text-sm">
                                    {type === 'income' ? 'Já recebido' : 'Já foi pago'}
                                </span>
                            </label>
                        )}

                        {/* Botões */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="flex-1 h-11 rounded-xl font-medium"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || !description.trim() || !amount}
                                className="flex-[2] h-11 rounded-xl font-semibold shadow-lg"
                                style={{
                                    background: config.gradient,
                                    color: 'white',
                                }}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <TypeIcon className="w-4 h-4 mr-2" />
                                        {mode === 'add' ? 'Adicionar' : 'Salvar'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // === MOBILE: Drawer com arrastar ===
    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50" />
                <Drawer.Content
                    className="fixed bottom-0 left-0 right-0 z-50 outline-none"
                    style={{ maxHeight: '90vh' }}
                    aria-describedby={undefined}
                >
                    {/* Visually hidden title for screen readers */}
                    <Drawer.Title className="sr-only">
                        {mode === 'add' ? 'Adicionar Transação' : 'Editar Transação'}
                    </Drawer.Title>
                    <Drawer.Description className="sr-only">
                        Formulário para {mode === 'add' ? 'adicionar nova' : 'editar'} transação
                    </Drawer.Description>
                    <div
                        className="rounded-t-3xl overflow-hidden"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                        {/* Drag handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div
                                className="w-10 h-1 rounded-full"
                                style={{ backgroundColor: 'var(--border-medium)' }}
                            />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pb-4">
                            <h2
                                className="text-lg font-semibold"
                                style={{ color: config.color }}
                            >
                                {title}
                            </h2>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="p-2 rounded-xl hover:bg-[var(--bg-hover)]"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
                            <FormContent />
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
