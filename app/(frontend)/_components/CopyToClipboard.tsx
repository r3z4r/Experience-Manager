'use client';

import React, { useState } from 'react';
import { ClipboardIcon, ClipboardCheckIcon } from 'lucide-react';

interface CopyToClipboardProps {
  text: string;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  successMessage?: string;
  successDuration?: number;
  label?: string;
  children?: React.ReactNode;
}

/**
 * A component that provides a button to copy text to clipboard
 */
export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  className = '',
  buttonClassName = '',
  iconClassName = 'w-4 h-4',
  successMessage = 'Copied!',
  successDuration = 2000,
  label = 'Copy',
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), successDuration);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={copyToClipboard}
        className={`inline-flex items-center gap-1 transition-colors ${buttonClassName}`}
        title="Copy to clipboard"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <>
            <ClipboardCheckIcon className={`text-green-500 ${iconClassName}`} />
            <span className="text-green-500 text-sm">{successMessage}</span>
          </>
        ) : (
          <>
            <ClipboardIcon className={iconClassName} />
            {children ? children : <span className="text-sm">{label}</span>}
          </>
        )}
      </button>
    </div>
  );
};
