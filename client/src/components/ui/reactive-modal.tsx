import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ReactiveModal({ 
  open, 
  onClose, 
  children, 
  title,
  size = 'md' 
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(
        "relative bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-6 m-4 w-full animate-scale-in",
        sizeClasses[size]
      )}>
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}