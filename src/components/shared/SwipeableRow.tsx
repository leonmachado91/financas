"use client";

import { cn } from '@/lib/utils';
import { useDrag } from '@use-gesture/react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { ReactNode, useRef, useState } from 'react';

interface SwipeableRowProps {
    /** Conteúdo da linha */
    children: ReactNode;
    /** Callback ao marcar como pago (swipe left) */
    onComplete?: () => void;
    /** Callback ao deletar (swipe right) */
    onDelete?: () => void;
    /** Se a ação de completar está disponível */
    canComplete?: boolean;
    /** Se a ação de deletar está disponível */
    canDelete?: boolean;
    /** Classes adicionais */
    className?: string;
    /** Se o item já está completo */
    isCompleted?: boolean;
}

const SWIPE_THRESHOLD = 80;
const MAX_SWIPE = 120;

/**
 * SwipeableRow - Linha com gestos de swipe para ações rápidas
 * 
 * Swipe left → Marcar como pago (verde)
 * Swipe right → Deletar (vermelho)
 */
export function SwipeableRow({
    children,
    onComplete,
    onDelete,
    canComplete = true,
    canDelete = true,
    className,
    isCompleted = false,
}: SwipeableRowProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [offset, setOffset] = useState(0);
    const dragRef = useRef<HTMLDivElement>(null);

    // Motion values para transforms
    const x = useMotionValue(0);
    const leftBgOpacity = useTransform(x, [-MAX_SWIPE, -SWIPE_THRESHOLD, 0], [1, 0.8, 0]);
    const rightBgOpacity = useTransform(x, [0, SWIPE_THRESHOLD, MAX_SWIPE], [0, 0.8, 1]);
    const leftIconScale = useTransform(x, [-MAX_SWIPE, -SWIPE_THRESHOLD, 0], [1.2, 1, 0.5]);
    const rightIconScale = useTransform(x, [0, SWIPE_THRESHOLD, MAX_SWIPE], [0.5, 1, 1.2]);

    useDrag(
        ({ movement: [mx], down }) => {
            // Limitar o swipe
            const clampedX = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, mx));

            if (down) {
                x.set(clampedX);
                setOffset(clampedX);
            } else {
                // Ao soltar, verificar se passou do threshold
                if (mx < -SWIPE_THRESHOLD && canComplete && !isCompleted) {
                    // Swipe left - completar com animação de scale
                    setIsCompleting(true);
                    x.set(0);
                    setOffset(0);
                    setTimeout(() => {
                        onComplete?.();
                        setIsCompleting(false);
                    }, 300);
                    // Vibrar se disponível
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                } else if (mx > SWIPE_THRESHOLD && canDelete) {
                    // Swipe right - deletar com animação de slide-out
                    setIsDeleting(true);
                    x.set(MAX_SWIPE * 2);
                    setTimeout(() => {
                        onDelete?.();
                    }, 300);
                    // Vibrar se disponível
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate([50, 30, 50]);
                    }
                } else {
                    // Voltar à posição original
                    x.set(0);
                    setOffset(0);
                }
            }
        },
        {
            target: dragRef,
            axis: 'x',
            filterTaps: true,
        }
    );

    return (
        <AnimatePresence>
            {!isDeleting && (
                <motion.div
                    className={cn("relative overflow-hidden rounded-xl", className)}
                    initial={{ opacity: 1, x: 0, scale: 1 }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        scale: isCompleting ? 1.02 : 1,
                        backgroundColor: isCompleting ? 'var(--accent-success-bg)' : 'transparent'
                    }}
                    exit={{ opacity: 0, x: 200, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    {/* Background esquerdo - Completar (verde) */}
                    {canComplete && !isCompleted && (
                        <motion.div
                            className="absolute inset-y-0 left-0 w-full flex items-center justify-start pl-6"
                            style={{
                                opacity: leftBgOpacity,
                                backgroundColor: 'var(--accent-success)',
                            }}
                        >
                            <motion.div style={{ scale: leftIconScale }}>
                                <Check className="w-6 h-6 text-white" />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Background direito - Deletar (vermelho) */}
                    {canDelete && (
                        <motion.div
                            className="absolute inset-y-0 right-0 w-full flex items-center justify-end pr-6"
                            style={{
                                opacity: rightBgOpacity,
                                backgroundColor: 'var(--accent-danger)',
                            }}
                        >
                            <motion.div style={{ scale: rightIconScale }}>
                                <Trash2 className="w-6 h-6 text-white" />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Conteúdo */}
                    <motion.div
                        ref={dragRef}
                        style={{ x }}
                        className="relative touch-pan-y cursor-grab active:cursor-grabbing"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

