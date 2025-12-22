"use client";

import { ReactNode } from 'react';

interface AppShellProps {
    children: ReactNode;
    /** Mostrar BottomNav (padrão: true em mobile) */
    showBottomNav?: boolean;
    /** Mostrar TopBar (padrão: true) */
    showTopBar?: boolean;
}

/**
 * AppShell - Container principal do app
 * 
 * Gerencia o layout responsivo com safe areas para dispositivos móveis,
 * padding correto para TopBar e BottomNav.
 */
export function AppShell({
    children,
    showBottomNav = true,
    showTopBar = true
}: AppShellProps) {
    return (
        <div
            className="min-h-screen w-full flex flex-col"
            style={{
                backgroundColor: 'var(--bg-primary)',
                paddingTop: showTopBar ? 'var(--topbar-height)' : '0',
                paddingBottom: showBottomNav ? 'calc(var(--bottomnav-height) + var(--safe-area-bottom))' : '0'
            }}
        >
            {children}
        </div>
    );
}
