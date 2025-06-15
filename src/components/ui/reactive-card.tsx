import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function ReactiveCard({ children, className }: CardProps) {
  return (
    <div className={cn(
      "bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-800/50 p-6",
      className
    )}>
      {children}
    </div>
  );
}

export function ReactiveCardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("pb-4 border-b border-zinc-800", className)}>
      {children}
    </div>
  );
}

export function ReactiveCardContent({ children, className }: CardProps) {
  return (
    <div className={cn("pt-6", className)}>
      {children}
    </div>
  );
}