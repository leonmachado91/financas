"use client";

import { cn } from '@/lib/utils';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

interface BalanceCardProps {
    totalIncome: number;
    totalExpenses: number;
    className?: string;
}

function formatCurrency(value: number): string {
    return `R$ ${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BalanceCard({ totalIncome, totalExpenses, className }: BalanceCardProps) {
    const balance = totalIncome - totalExpenses;
    const isPositive = balance >= 0;

    return (
        <div className={cn("grid grid-cols-3 gap-4", className)}>
            {/* Receitas */}
            <div className="bg-[#141F16]/80 border border-green-900/30 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                    <ArrowUpCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Receitas</span>
                    <span className="text-xl font-bold text-green-500">
                        {formatCurrency(totalIncome)}
                    </span>
                </div>
            </div>

            {/* Despesas */}
            <div className="bg-[#1F1414]/80 border border-red-900/30 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3 bg-red-500/20 rounded-xl">
                    <ArrowDownCircle className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Despesas</span>
                    <span className="text-xl font-bold text-red-500">
                        {formatCurrency(totalExpenses)}
                    </span>
                </div>
            </div>

            {/* Saldo */}
            <div className={cn(
                "border rounded-2xl p-5 flex items-center gap-4",
                isPositive
                    ? "bg-[#141F16]/80 border-green-900/30"
                    : "bg-[#1F1414]/80 border-red-900/30"
            )}>
                <div className={cn(
                    "p-3 rounded-xl",
                    isPositive ? "bg-green-500/20" : "bg-red-500/20"
                )}>
                    <Wallet className={cn("w-6 h-6", isPositive ? "text-green-500" : "text-red-500")} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Saldo</span>
                    <span className={cn(
                        "text-xl font-bold",
                        isPositive ? "text-green-500" : "text-red-500"
                    )}>
                        {isPositive ? '' : '-'}{formatCurrency(balance)}
                    </span>
                </div>
            </div>
        </div>
    );
}
