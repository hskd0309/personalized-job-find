import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function ReactiveInput({ 
  label, 
  error, 
  className, 
  ...props 
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}