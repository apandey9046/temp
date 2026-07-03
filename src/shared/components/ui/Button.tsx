import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const variants = {
  primary: 'bg-primary text-white hover:bg-black/90 active:bg-black/80 shadow-sm',
  secondary: 'bg-secondary text-primary hover:bg-hover active:bg-active border border-border',
  ghost: 'bg-transparent text-primary hover:bg-hover active:bg-active',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
  icon: 'p-2 flex items-center justify-center rounded-full hover:bg-hover active:bg-active',
};

const sizes = {
  xs: 'h-8 px-3 text-[11px] font-bold tracking-tight uppercase',
  sm: 'h-10 px-4 text-sm font-semibold',
  md: 'h-11 px-6 text-sm font-semibold',
  lg: 'h-13 px-8 text-base font-semibold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/5 disabled:opacity-40 disabled:pointer-events-none rounded-button',
          variants[variant],
          variant !== 'icon' && sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[2.5px]" />}
        <span className={cn(isLoading && "opacity-0")}>{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
