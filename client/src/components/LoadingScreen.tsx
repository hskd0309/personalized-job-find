import React from 'react';
import { Loader2, CheckCircle, Briefcase } from 'lucide-react';

interface LoadingScreenProps {
  isOpen: boolean;
  onComplete: () => void;
  message?: string;
}

export function LoadingScreen({ isOpen, onComplete, message = "Submitting your application..." }: LoadingScreenProps) {
  const [phase, setPhase] = React.useState<'loading' | 'success'>('loading');

  React.useEffect(() => {
    if (isOpen) {
      setPhase('loading');
      const timer = setTimeout(() => {
        setPhase('success');
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
      <div className="bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-8 max-w-sm w-full mx-4 animate-scale-in">
        <div className="text-center">
          {phase === 'loading' ? (
            <>
              <div className="relative mb-6">
                <div className="h-16 w-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-zinc-300" />
                </div>
                <div className="absolute inset-0">
                  <Loader2 className="h-16 w-16 mx-auto text-zinc-400 animate-spin" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                Processing Application
              </h3>
              <p className="text-zinc-400 text-sm">
                {message}
              </p>
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="h-16 w-16 mx-auto bg-emerald-600/20 rounded-full flex items-center justify-center mb-4 animate-scale-in">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                Application Submitted!
              </h3>
              <p className="text-zinc-400 text-sm">
                Your application has been sent successfully
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}