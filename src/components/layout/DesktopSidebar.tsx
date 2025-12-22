"use client";

import { cn } from '@/lib/utils';
import { BarChart3, ChevronLeft, ChevronRight, Home, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItemProps {
    href: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    isCollapsed: boolean;
}

function NavItem({ href, icon: Icon, label, isActive, isCollapsed }: NavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                "hover:bg-[var(--bg-hover)]",
                isActive
                    ? "bg-[var(--accent-lime-glow)] text-[var(--accent-lime)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
        >
            <Icon
                className={cn("w-5 h-5 shrink-0", isActive && "text-[var(--accent-lime)]")}
                strokeWidth={isActive ? 2.5 : 2}
            />
            {!isCollapsed && (
                <span className="font-medium text-sm">{label}</span>
            )}
        </Link>
    );
}

interface DesktopSidebarProps {
    /** Classes adicionais */
    className?: string;
}

/**
 * DesktopSidebar - Barra lateral para navegação desktop
 * 
 * Visível apenas em md+ (768px+).
 * Inclui navegação principal, logo e perfil.
 */
export function DesktopSidebar({ className }: DesktopSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { href: '/dashboard', icon: Home, label: 'Dashboard' },
        { href: '/stats', icon: BarChart3, label: 'Estatísticas' },
        { href: '/settings', icon: Settings, label: 'Configurações' },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen z-40 hidden md:flex flex-col",
                "border-r transition-all duration-300",
                isCollapsed ? "w-[72px]" : "w-64",
                className
            )}
            style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
            }}
        >
            {/* Logo / Brand */}
            <div className={cn(
                "flex items-center gap-3 p-4 border-b",
                isCollapsed && "justify-center"
            )}
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black text-lg shrink-0"
                    style={{ background: 'var(--gradient-lime)' }}
                >
                    F
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col">
                        <span className="font-bold text-[var(--text-primary)]">
                            Finanças
                        </span>
                        <span className="text-xs text-[var(--text-tertiary)]">
                            Controle Financeiro
                        </span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        isActive={pathname === item.href}
                        isCollapsed={isCollapsed}
                    />
                ))}
            </nav>

            {/* Footer: Collapse toggle + Logout */}
            <div
                className="p-3 border-t space-y-2"
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                        "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]",
                        isCollapsed && "justify-center"
                    )}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-medium text-sm">Recolher</span>
                        </>
                    )}
                </button>

                {/* Logout */}
                <button
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                        "text-[var(--text-tertiary)] hover:text-[var(--accent-danger)] hover:bg-[var(--accent-danger-bg)]",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && (
                        <span className="font-medium text-sm">Sair</span>
                    )}
                </button>
            </div>
        </aside>
    );
}

/**
 * Larguras da sidebar para usar em cálculos de layout
 */
export const SIDEBAR_WIDTH = '16rem'; // 256px
export const SIDEBAR_WIDTH_COLLAPSED = '72px';
