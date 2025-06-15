import React from 'react';

export function ResumeBuilderPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Header matching Reactive Resume */}
      <header className="h-16 px-6 flex items-center border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-zinc-100 to-zinc-300 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2h8z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">Reactive Resume</span>
        </div>
      </header>

      {/* Full Page Iframe */}
      <main className="h-[calc(100vh-4rem)]">
        <iframe
          src="https://rxresu.me/"
          title="Reactive Resume Builder"
          className="w-full h-full border-0 outline-none"
          style={{ minHeight: 0 }}
          allow="clipboard-write; fullscreen"
        />
      </main>
    </div>
  );
}