"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryManager } from "./CategoryManager";
import { PaymentMethodManager } from "./PaymentMethodManager";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultTab?: 'categories' | 'payment-methods';
}

export function SettingsDialog({ open, onOpenChange, defaultTab = 'categories' }: SettingsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-[#1e1e1e] border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle>Configurações</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue={defaultTab} className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-900">
                        <TabsTrigger value="categories">Categorias</TabsTrigger>
                        <TabsTrigger value="payment-methods">Formas de Pagamento</TabsTrigger>
                    </TabsList>
                    <TabsContent value="categories" className="mt-4">
                        <CategoryManager />
                    </TabsContent>
                    <TabsContent value="payment-methods" className="mt-4">
                        <PaymentMethodManager />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
