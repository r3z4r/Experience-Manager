// Toast/snackbar for feedback on journey creation
'use client';
import React from 'react';

export interface WizardToastProps {
  message: string;
  type?: 'success' | 'error';
  open: boolean;
  onClose: () => void;
}

export const WizardToast: React.FC<WizardToastProps> = ({ message, type = 'success', open, onClose }) => {
  if (!open) return null;
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded shadow-lg flex items-center gap-2 transition-all
        ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      <button
        className="ml-4 text-white/80 hover:text-white text-lg font-bold focus:outline-none"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};
