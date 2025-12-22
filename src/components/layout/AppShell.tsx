"use client";

import { ReactNode } from 'react';
import { DesktopSidebar } from './DesktopSidebar';

interface AppShellProps {
    children: ReactNode;
    /** Mostrar BottomNav (padrão: true em mobile) */
    showBottomNav?: boolean;
    /** Mostrar TopBar (padrão: true) */
    showTopBar?: boolean;
    /** Mostrar Sidebar em desktop (padrão: true) */
    showSidebar?: boolean;
}

/**
 * AppShell - Container principal do app
 * 
 * Gerencia o layout responsivo:
 * - Mobile: TopBar + BottomNav, sem sidebar
 * - Desktop: TopBar + Sidebar lateral
 * 
 * Inclui safe areas para dispositivos móveis e
 * padding correto para TopBar, BottomNav e Sidebar.
 */
export function AppShell({
    children,
    showBottomNav = true,
    showTopBar = true,
    showSidebar = true,
}: AppShellProps) {
    return (
        <div className="min-h-screen w-full flex">
            {/* Desktop Sidebar - renderizada apenas em md+ via CSS interno */}
            {showSidebar && <DesktopSidebar />}

            {/* Main Content Area */}
            <div
                className={`
                    min-h-screen w-full flex flex-col transition-all duration-300
                    ${showSidebar ? 'md:ml-64' : ''}
                `}
                style={{
                    backgroundColor: 'var(--bg-primary)',
                    paddingTop: showTopBar ? 'var(--topbar-height)' : '0',
                    paddingBottom: showBottomNav ? 'calc(var(--bottomnav-height) + var(--safe-area-bottom))' : '0',
                }}
            >
                {children}
            </div>
        </div>
    );
}

// Constantes de largura da sidebar para uso em outros componentes
export const SIDEBAR_WIDTH = '16rem'; // 256px = w-64
export const SIDEBAR_WIDTH_COLLAPSED = '72px';
