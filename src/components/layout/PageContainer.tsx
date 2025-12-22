"use client";

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
    /** Classes adicionais */
    className?: string;
    /** Padding horizontal customizado */
    horizontalPadding?: 'none' | 'sm' | 'md' | 'lg';
    /** Padding vertical customizado */
    verticalPadding?: 'none' | 'sm' | 'md' | 'lg';
    /** Largura máxima */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    /** Centralizar horizontalmente */
    centered?: boolean;
}

const horizontalPaddingMap = {
    none: 'px-0',
    sm: 'px-3 md:px-4',
    md: 'px-4 md:px-6',
    lg: 'px-6 md:px-8',
};

const verticalPaddingMap = {
    none: 'py-0',
    sm: 'py-3 md:py-4',
    md: 'py-4 md:py-6',
    lg: 'py-6 md:py-8',
};

const maxWidthMap = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
};

/**
 * PageContainer - Wrapper para conteúdo de páginas
 * 
 * Fornece padding responsivo, largura máxima e centralização.
 */
export function PageContainer({
    children,
    className,
    horizontalPadding = 'md',
    verticalPadding = 'md',
    maxWidth = 'xl',
    centered = true,
}: PageContainerProps) {
    return (
        <div
            className={cn(
                "w-full flex-1",
                horizontalPaddingMap[horizontalPadding],
                verticalPaddingMap[verticalPadding],
                maxWidthMap[maxWidth],
                centered && "mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
}
