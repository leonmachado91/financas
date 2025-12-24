"use client";

import { AppShell, BottomNav, PageContainer, TopBar } from '@/components/layout';
import { useCategories } from '@/hooks/useCategories';
import { ChevronRight, CreditCard, FolderOpen, User } from 'lucide-react';
import Link from 'next/link';

interface SettingsItemProps {
    icon: React.ElementType;
    label: string;
    description?: string;
    href?: string;
    onClick?: () => void;
    badge?: string;
}

function SettingsItem({ icon: Icon, label, description, href, onClick, badge }: SettingsItemProps) {
    const content = (
        <div
            className="flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
            onClick={onClick}
        >
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-lime-bg)' }}
            >
                <Icon className="w-5 h-5" style={{ color: 'var(--accent-lime)' }} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {label}
                </p>
                {description && (
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {description}
                    </p>
                )}
            </div>
            {badge && (
                <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                    }}
                >
                    {badge}
                </span>
            )}
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}

export default function SettingsPage() {
    const { data: categories = [] } = useCategories();

    return (
        <AppShell>
            <TopBar title="Configurações" />

            <PageContainer className="space-y-6">
                {/* Perfil Section */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                    <SettingsItem
                        icon={User}
                        label="Perfil"
                        description="Leonardo & Flávia"
                    />
                </div>

                {/* Dados Section */}
                <div>
                    <h2
                        className="text-sm font-semibold mb-3 px-1"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        DADOS
                    </h2>
                    <div
                        className="rounded-2xl overflow-hidden divide-y"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-subtle)',
                        }}
                    >
                        <SettingsItem
                            icon={FolderOpen}
                            label="Categorias"
                            description="Organize suas transações"
                            badge={`${categories.length}`}
                        />
                        <SettingsItem
                            icon={CreditCard}
                            label="Métodos de Pagamento"
                            description="Cartões, Pix, Dinheiro"
                        />
                    </div>
                </div>

                {/* App Info */}
                <div className="text-center pt-8">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Finanças v2.0
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        Redesign UI/UX 2024
                    </p>
                </div>
            </PageContainer>

            <BottomNav />
        </AppShell>
    );
}
