"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date) => void;
    placeholder?: string;
    className?: string;
}

const MONTHS = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
];

const MONTHS_SHORT = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

export function DatePicker({ value, onChange, placeholder = "Selecionar data", className }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [viewMode, setViewMode] = React.useState<"days" | "months" | "years">("days");

    // Mês/ano sendo visualizado
    const [viewDate, setViewDate] = React.useState(() => value || new Date());

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    // Para seleção de ano
    const startYear = Math.floor(currentYear / 12) * 12;

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);

    // Dias do mês anterior para preencher início
    const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);

    const handlePrevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handlePrevYear = () => {
        setViewDate(new Date(currentYear - 1, currentMonth, 1));
    };

    const handleNextYear = () => {
        setViewDate(new Date(currentYear + 1, currentMonth, 1));
    };

    const handlePrevYearRange = () => {
        setViewDate(new Date(currentYear - 12, currentMonth, 1));
    };

    const handleNextYearRange = () => {
        setViewDate(new Date(currentYear + 12, currentMonth, 1));
    };

    const handleSelectDay = (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day);
        onChange?.(newDate);
        setOpen(false);
    };

    const handleSelectMonth = (month: number) => {
        setViewDate(new Date(currentYear, month, 1));
        setViewMode("days");
    };

    const handleSelectYear = (year: number) => {
        setViewDate(new Date(year, currentMonth, 1));
        setViewMode("months");
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    const isSelected = (day: number) => {
        if (!value) return false;
        return (
            day === value.getDate() &&
            currentMonth === value.getMonth() &&
            currentYear === value.getFullYear()
        );
    };

    // Gerar grid de dias
    const renderDays = () => {
        const days: React.ReactNode[] = [];

        // Dias do mês anterior
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push(
                <div
                    key={`prev-${i}`}
                    className="w-9 h-9 flex items-center justify-center text-sm opacity-30"
                >
                    {prevMonthDays - i}
                </div>
            );
        }

        // Dias do mês atual
        for (let day = 1; day <= daysInMonth; day++) {
            const selected = isSelected(day);
            const today = isToday(day);

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={cn(
                        "w-9 h-9 flex items-center justify-center text-sm rounded-lg transition-colors",
                        "hover:bg-[var(--bg-hover)]",
                        selected && "bg-[var(--accent-primary)] text-white font-medium",
                        today && !selected && "ring-1 ring-[var(--accent-primary)]",
                    )}
                >
                    {day}
                </button>
            );
        }

        // Dias do próximo mês para completar grid
        const totalCells = days.length;
        const remainingCells = 42 - totalCells; // 6 semanas x 7 dias
        for (let i = 1; i <= remainingCells; i++) {
            days.push(
                <div
                    key={`next-${i}`}
                    className="w-9 h-9 flex items-center justify-center text-sm opacity-30"
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    // Renderizar seletor de meses
    const renderMonths = () => {
        return MONTHS_SHORT.map((month, index) => (
            <button
                key={month}
                type="button"
                onClick={() => handleSelectMonth(index)}
                className={cn(
                    "h-10 flex items-center justify-center text-sm rounded-lg transition-colors",
                    "hover:bg-[var(--bg-hover)]",
                    currentMonth === index && "bg-[var(--accent-primary)] text-white font-medium"
                )}
            >
                {month}
            </button>
        ));
    };

    // Renderizar seletor de anos
    const renderYears = () => {
        const years: React.ReactNode[] = [];
        for (let i = 0; i < 12; i++) {
            const year = startYear + i;
            years.push(
                <button
                    key={year}
                    type="button"
                    onClick={() => handleSelectYear(year)}
                    className={cn(
                        "h-10 flex items-center justify-center text-sm rounded-lg transition-colors",
                        "hover:bg-[var(--bg-hover)]",
                        currentYear === year && "bg-[var(--accent-primary)] text-white font-medium"
                    )}
                >
                    {year}
                </button>
            );
        }
        return years;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "h-10 rounded-lg text-sm w-full flex items-center justify-between px-3 gap-2",
                        "border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]",
                        "text-[var(--text-primary)]",
                        className
                    )}
                >
                    <span className={value ? "" : "opacity-50"}>
                        {value
                            ? value.toLocaleDateString("pt-BR")
                            : placeholder
                        }
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-[280px] p-0"
                style={{ backgroundColor: 'var(--bg-elevated)' }}
            >
                <div className="p-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={
                                viewMode === "days" ? handlePrevMonth :
                                    viewMode === "months" ? handlePrevYear :
                                        handlePrevYearRange
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (viewMode === "days") setViewMode("months");
                                else if (viewMode === "months") setViewMode("years");
                                else setViewMode("days");
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-sm font-medium"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {viewMode === "days" && (
                                <>
                                    {MONTHS_SHORT[currentMonth].toUpperCase()} {currentYear}
                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                </>
                            )}
                            {viewMode === "months" && currentYear}
                            {viewMode === "years" && `${startYear} - ${startYear + 11}`}
                        </button>

                        <button
                            type="button"
                            onClick={
                                viewMode === "days" ? handleNextMonth :
                                    viewMode === "months" ? handleNextYear :
                                        handleNextYearRange
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        </button>
                    </div>

                    {/* Days View */}
                    {viewMode === "days" && (
                        <>
                            {/* Weekdays header */}
                            <div className="grid grid-cols-7 gap-0 mb-1">
                                {WEEKDAYS.map((day, i) => (
                                    <div
                                        key={i}
                                        className="w-9 h-8 flex items-center justify-center text-xs font-medium"
                                        style={{ color: 'var(--text-tertiary)' }}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days grid */}
                            <div
                                className="grid grid-cols-7 gap-0"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {renderDays()}
                            </div>
                        </>
                    )}

                    {/* Months View */}
                    {viewMode === "months" && (
                        <div
                            className="grid grid-cols-3 gap-1"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {renderMonths()}
                        </div>
                    )}

                    {/* Years View */}
                    {viewMode === "years" && (
                        <div
                            className="grid grid-cols-3 gap-1"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {renderYears()}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
