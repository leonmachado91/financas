"use client";

import { AddTransactionPopover } from '@/components/shared/AddTransactionPopover';
import { cn } from '@/lib/utils';
import { BarChart3, Home, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
    href: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
}

function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all",
                isActive
                    ? "text-[var(--accent-lime)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            )}
        >
            <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
        </Link>
    );
}

/**
 * BottomNav - Navegação inferior com FAB central
 * 
 * Mobile: Barra fixa no fundo com navegação + FAB central
 * Desktop: FAB flutuante no canto inferior direito
 * 
 * Usa AddTransactionPopover para garantir consistência visual.
 */
export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', icon: Home, label: 'Home' },
        { href: '/stats', icon: BarChart3, label: 'Stats' },
    ];

    const settingsItem = { href: '/settings', icon: Settings, label: 'Config' };

    return (
        <>
            {/* === MOBILE: Barra de navegação completa === */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                style={{ paddingBottom: 'var(--safe-area-bottom)' }}
            >
                {/* Background com blur */}
                <div
                    className="absolute inset-0 border-t"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-subtle)',
                        opacity: 0.98
                    }}
                />

                <div className="relative h-16 flex items-center justify-around px-4">
                    {/* Items da esquerda */}
                    {navItems.map((item) => (
                        <NavItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={pathname === item.href}
                        />
                    ))}

                    {/* FAB Central com Popover */}
                    <div className="relative -mt-8">
                        <AddTransactionPopover side="top" align="center" />

                        {/* Subtle glow effect */}
                        <div
                            className="absolute inset-0 rounded-full blur-xl opacity-40 -z-10 pointer-events-none"
                            style={{ background: 'var(--accent-lime)' }}
                        />
                    </div>

                    {/* Item da direita */}
                    <NavItem
                        href={settingsItem.href}
                        icon={settingsItem.icon}
                        label={settingsItem.label}
                        isActive={pathname === settingsItem.href}
                    />

                    {/* Spacer para balancear o layout */}
                    <div className="w-16" />
                </div>
            </nav>

            {/* === DESKTOP: FAB flutuante no canto === */}
            <div className="hidden md:block fixed bottom-6 right-6 z-50">
                <AddTransactionPopover side="top" align="end" />

                {/* Subtle glow effect */}
                <div
                    className="absolute inset-0 rounded-full blur-xl opacity-40 -z-10 pointer-events-none"
                    style={{ background: 'var(--accent-lime)' }}
                />
            </div>
        </>
    );
}
