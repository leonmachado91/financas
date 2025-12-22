"use client";

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppState } from '@/lib/appState';
import { cn } from '@/lib/utils';
import { Bell, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

interface TopBarProps {
    /** Título opcional (se não fornecido, mostra MonthPicker) */
    title?: string;
    /** Ação de voltar */
    onBack?: () => void;
    /** Conteúdo customizado no centro */
    centerContent?: ReactNode;
    /** Ações adicionais à direita */
    rightActions?: ReactNode;
    /** Mostrar seletor de mês */
    showMonthPicker?: boolean;
    /** Data atual para o MonthPicker */
    currentDate?: Date;
    /** Callback quando mês muda */
    onMonthChange?: (date: Date) => void;
}

const profiles = [
    { id: 'Leonardo', name: 'Leonardo', initials: 'LE', color: 'bg-blue-500' },
    { id: 'Compartilhado', name: 'Compartilhado', initials: 'CO', color: 'bg-purple-500' },
] as const;

/**
 * TopBar - Header minimal fixo no topo
 * 
 * Inclui navegação, MonthPicker inline e acesso ao perfil.
 * Backdrop blur ao scrollar.
 */
export function TopBar({
    title,
    onBack,
    centerContent,
    rightActions,
    showMonthPicker = false,
    currentDate,
    onMonthChange,
}: TopBarProps) {
    const { selectedProfile, setSelectedProfile } = useAppState();
    const [scrolled, setScrolled] = useState(false);

    // Detectar scroll para backdrop blur
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentProfile = profiles.find(p => p.id === selectedProfile) || profiles[0];

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    };

    const handlePrevMonth = () => {
        if (!currentDate) return;
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        onMonthChange?.(newDate);
    };

    const handleNextMonth = () => {
        if (!currentDate) return;
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        onMonthChange?.(newDate);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 h-14 md:h-16 flex items-center justify-between px-4 md:px-6 transition-all",
                "md:left-64", // Offset para sidebar em desktop
                scrolled
                    ? "bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)]"
                    : "bg-transparent"
            )}
            style={{ paddingTop: 'var(--safe-area-top)' }}
        >
            {/* Lado Esquerdo */}
            <div className="flex items-center gap-3 min-w-[120px]">
                {onBack ? (
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black text-sm"
                            style={{ background: 'var(--gradient-lime)' }}
                        >
                            F
                        </div>
                        <span className="font-semibold text-[var(--text-primary)] hidden md:inline">
                            Finanças
                        </span>
                    </div>
                )}
            </div>

            {/* Centro */}
            <div className="flex-1 flex items-center justify-center">
                {centerContent ? (
                    centerContent
                ) : showMonthPicker ? (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-[var(--text-primary)] font-medium capitalize min-w-[140px] text-center">
                            {currentDate ? formatMonth(currentDate) : ''}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : title ? (
                    <h1 className="text-[var(--text-primary)] font-semibold text-lg">
                        {title}
                    </h1>
                ) : null}
            </div>

            {/* Lado Direito */}
            <div className="flex items-center gap-2 min-w-[120px] justify-end">
                {rightActions}

                {/* Notificações */}
                <button className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all">
                    <Bell className="w-5 h-5" />
                    <span
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                        style={{ backgroundColor: 'var(--accent-danger)' }}
                    />
                </button>

                {/* Seletor de Perfil */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-xl outline-none hover:bg-[var(--bg-hover)] transition-all">
                        <Avatar className={cn("h-8 w-8 border-2 border-white/10", currentProfile.color)}>
                            <AvatarFallback className="bg-transparent text-white font-medium text-xs">
                                {currentProfile.initials}
                            </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-3 h-3 text-[var(--text-tertiary)] hidden md:block" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="min-w-[180px]"
                        style={{
                            backgroundColor: 'var(--bg-elevated)',
                            borderColor: 'var(--border-medium)'
                        }}
                    >
                        {profiles.map((profile) => (
                            <DropdownMenuItem
                                key={profile.id}
                                onClick={() => setSelectedProfile(profile.id)}
                                className="flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-hover)]"
                            >
                                <Avatar className={cn("h-7 w-7", profile.color)}>
                                    <AvatarFallback className="bg-transparent text-white text-xs font-medium">
                                        {profile.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-[var(--text-primary)]">{profile.name}</span>
                                {selectedProfile === profile.id && (
                                    <span className="ml-auto" style={{ color: 'var(--accent-lime)' }}>✓</span>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
