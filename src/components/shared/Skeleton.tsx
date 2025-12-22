"use client";

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
}

/**
 * Skeleton base - pulse animation
 */
export function Skeleton({ className }: SkeletonProps) {
    return (
        <motion.div
            className={cn(
                "rounded-lg",
                className
            )}
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    );
}

/**
 * Skeleton para BalanceCard
 */
export function BalanceCardSkeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn("rounded-3xl p-6", className)}
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-8 h-8 rounded-lg" />
            </div>

            {/* Saldo */}
            <Skeleton className="w-48 h-12 mb-4" />

            {/* Income/Expense */}
            <div className="flex gap-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-16 h-4" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-16 h-4" />
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton para TransactionRow
 */
export function TransactionRowSkeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-4 p-4 rounded-xl",
                className
            )}
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            {/* Ícone */}
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-20 h-3" />
            </div>

            {/* Valor */}
            <Skeleton className="w-20 h-5" />
        </div>
    );
}

/**
 * Skeleton para grupo de transações
 */
export function TransactionGroupSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <Skeleton className="w-24 h-5 mb-3" />

            {/* Rows */}
            {Array.from({ length: count }).map((_, i) => (
                <TransactionRowSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Skeleton para gráfico donut
 */
export function ChartDonutSkeleton({ className }: SkeletonProps) {
    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <Skeleton className="w-48 h-48 rounded-full" />
            <div className="space-y-2 w-full max-w-[200px]">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-2/3 h-4" />
            </div>
        </div>
    );
}

/**
 * Skeleton para QuickActions
 */
export function QuickActionsSkeleton({ className }: SkeletonProps) {
    return (
        <div className={cn("flex gap-3", className)}>
            <Skeleton className="flex-1 h-12 rounded-xl" />
            <Skeleton className="flex-1 h-12 rounded-xl" />
        </div>
    );
}

/**
 * Skeleton para MonthPicker
 */
export function MonthPickerSkeleton({ className }: SkeletonProps) {
    return (
        <div className={cn("flex items-center justify-center gap-2", className)}>
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
    );
}

/**
 * Dashboard completo em loading state
 */
export function DashboardSkeleton() {
    return (
        <div className="space-y-6 p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <MonthPickerSkeleton className="mb-4" />
            <BalanceCardSkeleton />
            <QuickActionsSkeleton />
            <TransactionGroupSkeleton count={2} />
            <TransactionGroupSkeleton count={3} />
        </div>
    );
}
