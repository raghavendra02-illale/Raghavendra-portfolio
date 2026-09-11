import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1b273e]/95 backdrop-blur-md text-[#06b6d4] border border-[#06b6d4]/50 shadow-2xl max-w-md shadow-[#06b6d4]/10"
        >
          <span className="material-symbols-outlined text-[20px] text-[#10b981] shrink-0">
            check_circle
          </span>
          <span className="font-mono text-xs text-[#f1f5f9] font-medium leading-tight">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

