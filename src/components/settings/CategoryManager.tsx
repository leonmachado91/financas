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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoriesService } from "@/services/categoriesService";
import { Category } from "@/types";
import {
    Banknote, Car, CreditCard, Gamepad2, GraduationCap, Heart,
    Home, Laptop, Loader2, Palette, Pizza, Plane, ShoppingBag, Sparkles,
    Trash2, Utensils, Wallet, Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Lista de ícones disponíveis
const availableIcons = [
    { name: 'pizza', icon: Pizza, label: 'Alimentação' },
    { name: 'car', icon: Car, label: 'Transporte' },
    { name: 'home', icon: Home, label: 'Casa' },
    { name: 'gamepad2', icon: Gamepad2, label: 'Lazer' },
    { name: 'heart', icon: Heart, label: 'Saúde' },
    { name: 'graduation-cap', icon: GraduationCap, label: 'Educação' },
    { name: 'shopping-bag', icon: ShoppingBag, label: 'Compras' },
    { name: 'laptop', icon: Laptop, label: 'Tecnologia' },
    { name: 'plane', icon: Plane, label: 'Viagem' },
    { name: 'utensils', icon: Utensils, label: 'Restaurante' },
    { name: 'banknote', icon: Banknote, label: 'Salário' },
    { name: 'sparkles', icon: Sparkles, label: 'Investimento' },
    { name: 'zap', icon: Zap, label: 'Energia' },
    { name: 'credit-card', icon: CreditCard, label: 'Cartão' },
    { name: 'wallet', icon: Wallet, label: 'Outros' },
];

// Paleta de cores
const colorPalette = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#a855f7', // purple
    '#ec4899', // pink
    '#6b7280', // gray
];

function getIconComponent(iconName?: string | null) {
    const found = availableIcons.find(i => i.name === iconName);
    return found?.icon || Wallet;
}

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState<'income' | 'expense'>('expense');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            const data = await categoriesService.getAll();
            setCategories(data);
        } catch {
            toast.error("Erro ao carregar categorias");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsSubmitting(true);
        try {
            await categoriesService.create({
                name: newName,
                type: newType,
                icon: 'wallet',
                color: newType === 'income' ? '#22c55e' : '#ef4444'
            });
            setNewName("");
            await fetchCategories();
            toast.success("Categoria criada!");
        } catch {
            toast.error("Erro ao criar categoria");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await categoriesService.delete(id);
            await fetchCategories();
            toast.success("Categoria excluída!");
        } catch {
            toast.error("Erro ao excluir categoria");
        }
    };

    const handleUpdateIcon = async (id: string, icon: string) => {
        try {
            await categoriesService.update(id, { icon });
            setCategories(prev => prev.map(c => c.id === id ? { ...c, icon } : c));
            toast.success("Ícone atualizado!");
        } catch {
            toast.error("Erro ao atualizar ícone");
        }
    };

    const handleUpdateColor = async (id: string, color: string) => {
        try {
            await categoriesService.update(id, { color });
            setCategories(prev => prev.map(c => c.id === id ? { ...c, color } : c));
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
                        placeholder="Ex: Alimentação"
                        disabled={isSubmitting}
                    />
                </div>
                <div className="w-[140px] space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select value={newType} onValueChange={(val: 'income' | 'expense') => setNewType(val)} disabled={isSubmitting}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Receita</SelectItem>
                            <SelectItem value="expense">Despesa</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" disabled={isSubmitting || !newName.trim()}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar"}
                </Button>
            </form>

            <div className="space-y-2">
                <h3 className="font-medium text-sm text-gray-400 uppercase tracking-wider">Categorias Existentes</h3>
                <div className="border rounded-md divide-y border-gray-800">
                    {categories.length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm">Nenhuma categoria cadastrada.</div>
                    )}
                    {categories.map((category) => {
                        const IconComponent = getIconComponent(category.icon);
                        const isEditing = editingId === category.id;

                        return (
                            <div key={category.id} className="p-3 hover:bg-gray-900/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Ícone clicável */}
                                        <button
                                            onClick={() => setEditingId(isEditing ? null : category.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                                            style={{ backgroundColor: `${category.color || '#6b7280'}20` }}
                                        >
                                            <IconComponent
                                                className="w-4 h-4"
                                                style={{ color: category.color || '#6b7280' }}
                                            />
                                        </button>
                                        <span>{category.name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${category.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {category.type === 'income' ? 'Receita' : 'Despesa'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingId(isEditing ? null : category.id)}
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
                                                    <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-400">
                                                        Tem certeza que deseja excluir &quot;{category.name}&quot;? Esta ação não pode ser desfeita.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 border-gray-700">Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(category.id)}
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
                                                        onClick={() => handleUpdateColor(category.id, color)}
                                                        className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${category.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}
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
                                                        onClick={() => handleUpdateIcon(category.id, name)}
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${category.icon === name ? 'ring-2 ring-white' : 'bg-gray-800'}`}
                                                        style={{ backgroundColor: category.icon === name ? category.color || '#6b7280' : undefined }}
                                                    >
                                                        <Icon className="w-4 h-4" style={{ color: category.icon === name ? 'white' : '#9ca3af' }} />
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
