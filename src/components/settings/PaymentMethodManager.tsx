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
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function PaymentMethodManager() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            await paymentMethodsService.create({ name: newName });
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
                    {methods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-3 hover:bg-gray-900/50 transition-colors">
                            <span>{method.name}</span>
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
                    ))}
                </div>
            </div>
        </div>
    );
}
