import React from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  return (
    <div
      className={`fixed top-20 right-6 z-50 transform transition-all duration-300 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1b273e] text-[#06b6d4] border border-[#06b6d4]/50 shadow-2xl max-w-md ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-5 pointer-events-none'
      }`}
    >
      <span className="material-symbols-outlined text-[20px] text-[#10b981] shrink-0">
        check_circle
      </span>
      <span className="font-mono text-xs text-[#f1f5f9] font-medium leading-tight">
        {message}
      </span>
    </div>
  );
};
