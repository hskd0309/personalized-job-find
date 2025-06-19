import React, { useState } from 'react';
import { Menu, X, FileText, Briefcase, User, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReactiveButton } from '@/components/ui/reactive-button';

export function ReactiveNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Resume Builder', href: '/app/resume-builder', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-zinc-100 tracking-tight">
              ReactiveJob
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-2 text-zinc-300 hover:text-primary transition-colors duration-200"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <ReactiveButton variant="outline" size="sm">
              Sign In
            </ReactiveButton>
            <ReactiveButton size="sm">
              Get Started
            </ReactiveButton>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <ReactiveButton variant="outline" className="w-full">
                  Sign In
                </ReactiveButton>
                <ReactiveButton className="w-full">
                  Get Started
                </ReactiveButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}