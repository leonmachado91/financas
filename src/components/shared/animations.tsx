"use client";

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// ============= Variantes de Animação =============

/**
 * Fade in simples
 */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

/**
 * Slide de baixo para cima com fade
 */
export const slideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

/**
 * Slide da direita para esquerda
 */
export const slideLeft: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
};

/**
 * Scale com bounce (para elementos destacados)
 */
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        }
    },
    exit: { opacity: 0, scale: 0.9 },
};

/**
 * Para listas - cada item aparece com delay escalonado
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

/**
 * Item de lista individual
 */
export const listItem: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 30,
        }
    },
    exit: {
        opacity: 0,
        x: -100,
        transition: { duration: 0.2 }
    },
};

// ============= Componentes de Animação =============

interface AnimatedListProps {
    children: ReactNode;
    className?: string;
}

/**
 * Container para listas animadas com stagger effect
 */
export function AnimatedList({ children, className }: AnimatedListProps) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface AnimatedItemProps {
    children: ReactNode;
    className?: string;
    /** Key única para AnimatePresence */
    itemKey?: string | number;
}

/**
 * Item de lista animado
 */
export function AnimatedItem({ children, className, itemKey }: AnimatedItemProps) {
    return (
        <motion.div
            layout
            variants={listItem}
            className={className}
            key={itemKey}
        >
            {children}
        </motion.div>
    );
}

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

/**
 * Wrapper para fade in simples
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface SlideUpProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

/**
 * Wrapper para slide up
 */
export function SlideUp({ children, className, delay = 0 }: SlideUpProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface AnimatedNumberProps {
    value: number;
    formatFn?: (value: number) => string;
    className?: string;
}

/**
 * Número que anima ao mudar de valor
 */
export function AnimatedNumber({
    value,
    formatFn = (v) => v.toString(),
    className
}: AnimatedNumberProps) {
    return (
        <motion.span
            key={value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={className}
        >
            {formatFn(value)}
        </motion.span>
    );
}

interface PressableProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

/**
 * Botão com feedback visual de press
 */
export function Pressable({
    children,
    onClick,
    className,
    disabled = false
}: PressableProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </motion.button>
    );
}

// Re-export essenciais do framer-motion
export { AnimatePresence, motion };

