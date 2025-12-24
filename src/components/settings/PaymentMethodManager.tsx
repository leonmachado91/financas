"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { paymentMethodsService } from "@/services/paymentMethodsService";
import { PaymentMethod } from "@/types";
import {
    ArrowRightLeft, Banknote, CreditCard, Loader2, Palette,
    Smartphone, Trash2, Wallet
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Lista de ícones para formas de pagamento
const availableIcons = [
    { name: 'credit-card', icon: CreditCard, label: 'Cartão' },
    { name: 'smartphone', icon: Smartphone, label: 'Pix' },
    { name: 'banknote', icon: Banknote, label: 'Dinheiro' },
    { name: 'arrow-right-left', icon: ArrowRightLeft, label: 'Transferência' },
    { name: 'wallet', icon: Wallet, label: 'Outros' },
];

// Paleta de cores
const colorPalette = [
    '#00bfa5', // pix
    '#f59e0b', // crédito
    '#3b82f6', // débito
    '#22c55e', // dinheiro
    '#a855f7', // roxo
    '#ec4899', // pink
    '#ef4444', // red
    '#6b7280', // gray
];

function getIconComponent(iconName?: string | null) {
    const found = availableIcons.find(i => i.name === iconName);
    return found?.icon || Wallet;
}

export function PaymentMethodManager() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchMethods = async () => {
        try {
            const data = await paymentMethodsService.getAll();
            setMethods(data);
        } catch {
            toast.error("Erro ao carregar formas de pagamento");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsSubmitting(true);
        try {
            await paymentMethodsService.create({
                name: newName,
                icon: 'wallet',
                color: '#6b7280'
            });
            setNewName("");
            await fetchMethods();
            toast.success("Forma de pagamento criada!");
        } catch {
            toast.error("Erro ao criar forma de pagamento");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await paymentMethodsService.delete(id);
            await fetchMethods();
            toast.success("Forma de pagamento excluída!");
        } catch {
            toast.error("Erro ao excluir forma de pagamento");
        }
    };

    const handleUpdateIcon = async (id: string, icon: string) => {
        try {
            await paymentMethodsService.update(id, { icon });
            setMethods(prev => prev.map(m => m.id === id ? { ...m, icon } : m));
            toast.success("Ícone atualizado!");
        } catch {
            toast.error("Erro ao atualizar ícone");
        }
    };

    const handleUpdateColor = async (id: string, color: string) => {
        try {
            await paymentMethodsService.update(id, { color });
            setMethods(prev => prev.map(m => m.id === id ? { ...m, color } : m));
            toast.success("Cor atualizada!");
        } catch {
            toast.error("Erro ao atualizar cor");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleAdd} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ex: Cartão de Crédito"
                        disabled={isSubmitting}
                    />
                </div>
                <Button type="submit" disabled={isSubmitting || !newName.trim()}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar"}
                </Button>
            </form>

            <div className="space-y-2">
                <h3 className="font-medium text-sm text-gray-400 uppercase tracking-wider">Formas de Pagamento</h3>
                <div className="border rounded-md divide-y border-gray-800">
                    {methods.length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm">Nenhuma forma de pagamento cadastrada.</div>
                    )}
                    {methods.map((method) => {
                        const IconComponent = getIconComponent(method.icon);
                        const isEditing = editingId === method.id;

                        return (
                            <div key={method.id} className="p-3 hover:bg-gray-900/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Ícone clicável */}
                                        <button
                                            onClick={() => setEditingId(isEditing ? null : method.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                                            style={{ backgroundColor: `${method.color || '#6b7280'}20` }}
                                        >
                                            <IconComponent
                                                className="w-4 h-4"
                                                style={{ color: method.color || '#6b7280' }}
                                            />
                                        </button>
                                        <span>{method.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingId(isEditing ? null : method.id)}
                                            className="p-1.5 rounded hover:bg-gray-800 transition-colors"
                                        >
                                            <Palette className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-[#1C1C1C] border-gray-800 text-white">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Excluir forma de pagamento?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-400">
                                                        Tem certeza que deseja excluir &quot;{method.name}&quot;? Esta ação não pode ser desfeita.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 border-gray-700">Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(method.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Excluir
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>

                                {/* Painel de edição expandido */}
                                {isEditing && (
                                    <div className="mt-3 pt-3 border-t border-gray-800 space-y-3">
                                        {/* Seletor de cor */}
                                        <div>
                                            <label className="text-xs text-gray-400 mb-2 block">Cor</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {colorPalette.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleUpdateColor(method.id, color)}
                                                        className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${method.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Seletor de ícone */}
                                        <div>
                                            <label className="text-xs text-gray-400 mb-2 block">Ícone</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {availableIcons.map(({ name, icon: Icon }) => (
                                                    <button
                                                        key={name}
                                                        onClick={() => handleUpdateIcon(method.id, name)}
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${method.icon === name ? 'ring-2 ring-white' : 'bg-gray-800'}`}
                                                        style={{ backgroundColor: method.icon === name ? method.color || '#6b7280' : undefined }}
                                                    >
                                                        <Icon className="w-4 h-4" style={{ color: method.icon === name ? 'white' : '#9ca3af' }} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
