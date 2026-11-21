import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { modalBackdropVariants, modalSurfaceVariants } from '../../utils/motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
}) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={shouldReduceMotion ? undefined : modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog Surface */}
          <motion.div
            variants={shouldReduceMotion ? undefined : modalSurfaceVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full ${widthClasses[maxWidth]} bg-white border border-slate-200 rounded-2xl shadow-modal overflow-hidden z-10`}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 max-h-[75vh] overflow-y-auto text-slate-700 text-xs">{children}</div>

            {footer && (
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
