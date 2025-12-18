"use client";

import { CreditCard, Grid, LayoutDashboard, LogOut, Menu, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { SettingsDialog } from '../settings/SettingsDialog';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

// Componente interno para os itens de navegação
function NavItems({ onOpenSettings }: { onOpenSettings: (tab: 'categories' | 'payment-methods') => void }) {
    return (
        <>
            {/* Navegação Principal */}
            <nav className="flex-1 flex flex-col gap-6 w-full items-center">
                <button
                    onClick={() => onOpenSettings('categories')}
                    className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative group"
                >
                    <Grid className="w-6 h-6" />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        Categorias
                    </div>
                </button>

                <button
                    onClick={() => onOpenSettings('payment-methods')}
                    className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative group"
                >
                    <CreditCard className="w-6 h-6" />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        Formas de Pagamento
                    </div>
                </button>
            </nav>

            {/* Ações do Rodapé */}
            <div className="flex flex-col gap-6 w-full items-center">
                <button
                    onClick={() => onOpenSettings('categories')}
                    className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative group"
                >
                    <Settings className="w-6 h-6" />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        Configurações
                    </div>
                </button>
                <button className="p-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors relative group">
                    <LogOut className="w-6 h-6" />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        Sair
                    </div>
                </button>
            </div>
        </>
    );
}

export function Sidebar() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState<'categories' | 'payment-methods'>('categories');
    const [mobileOpen, setMobileOpen] = useState(false);

    const openSettings = (tab: 'categories' | 'payment-methods') => {
        setSettingsTab(tab);
        setSettingsOpen(true);
        setMobileOpen(false); // Fecha o menu mobile ao abrir settings
    };

    return (
        <>
            {/* Sidebar Desktop - oculta em mobile */}
            <div className="h-screen w-20 bg-[#1C1C1C] flex-col items-center py-6 border-r border-gray-800/50 fixed left-0 top-0 z-50 hidden md:flex">
                {/* Logo - Link para Dashboard */}
                <Link href="/dashboard" className="mb-10">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors">
                        <LayoutDashboard className="text-white w-6 h-6" />
                    </div>
                </Link>

                <NavItems onOpenSettings={openSettings} />
            </div>

            {/* Mobile Navigation com Sheet */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                    <button
                        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#1C1C1C] border border-gray-800 text-gray-400 hover:text-white hover:bg-white/5 transition-colors md:hidden"
                        aria-label="Menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-20 bg-[#1C1C1C] border-r border-gray-800/50 p-0">
                    <div className="h-full flex flex-col items-center py-6">
                        {/* Logo Mobile */}
                        <Link href="/dashboard" className="mb-10" onClick={() => setMobileOpen(false)}>
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors">
                                <LayoutDashboard className="text-white w-6 h-6" />
                            </div>
                        </Link>

                        {/* Botão Fechar */}
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <NavItems onOpenSettings={openSettings} />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Settings Dialog controlado pela Sidebar */}
            <SettingsDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                defaultTab={settingsTab}
            />
        </>
    );
}
