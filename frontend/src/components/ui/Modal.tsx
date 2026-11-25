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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog Surface */}
          <motion.div
            variants={shouldReduceMotion ? undefined : modalSurfaceVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full ${widthClasses[maxWidth]} bg-[#1C1F22] border border-[#35393D] rounded-sm shadow-modal overflow-hidden z-10`}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-3.5 border-b border-[#35393D] flex items-start justify-between gap-4 bg-[#17191B]">
              <div>
                <h3 className="text-xs font-semibold text-[#D9DEE2] font-mono uppercase tracking-wider">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-[11px] text-[#929BA3] mt-0.5 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-[#929BA3] hover:text-[#D9DEE2] p-1 rounded hover:bg-[#232629] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 max-h-[75vh] overflow-y-auto text-[#D9DEE2] text-xs">{children}</div>

            {footer && (
              <div className="px-4 py-2.5 bg-[#17191B] border-t border-[#35393D] flex items-center justify-end gap-2.5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
