import React, { forwardRef } from 'react';
import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <input
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-input border border-border bg-white px-4 py-2 text-sm font-playpen transition-all focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-primary placeholder:text-muted disabled:opacity-50 disabled:bg-secondary',
            error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[11px] font-bold text-red-500 ml-1 font-fredoka uppercase tracking-wider block"
          >
            {error}
          </motion.span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
