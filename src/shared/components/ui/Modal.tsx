import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[400] bg-black/5 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[401] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'w-full max-w-md bg-white p-8 rounded-modal shadow-2xl border border-border pointer-events-auto',
                className
              )}
            >
              <div className="flex items-center justify-between mb-6">
                {title && <h3 className="text-xl font-bold font-fredoka text-primary">{title}</h3>}
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-secondary rounded-full transition-colors ml-auto group"
                >
                  <X className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                </button>
              </div>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
