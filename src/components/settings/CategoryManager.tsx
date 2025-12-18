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
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState<'income' | 'expense'>('expense');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            await categoriesService.create({ name: newName, type: newType });
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
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 hover:bg-gray-900/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${category.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span>{category.name}</span>
                            </div>
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
                    ))}
                </div>
            </div>
        </div>
    );
}
