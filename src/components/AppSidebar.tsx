import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  User,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { ReactiveButton } from './ui/reactive-button';

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Job Search', href: '/app/job-search', icon: Search },
    { name: 'Applications', href: '/app/applications', icon: Briefcase },
    { name: 'Resume Builder', href: '/app/resume-builder', icon: FileText },
    { name: 'Resume Analyzer', href: '/app/resume-analyzer', icon: BarChart3 },
    { name: 'Job Recommendations', href: '/app/job-recommendations', icon: PlusCircle },
    { name: 'Career Chat', href: '/app/career-chat', icon: MessageSquare },
    { name: 'Profile', href: '/app/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <ReactiveButton
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="transition-all duration-300 hover:scale-110"
        >
          <div className="relative">
            {isCollapsed ? (
              <Menu className="h-5 w-5 transition-transform duration-300 rotate-0" />
            ) : (
              <X className="h-5 w-5 transition-transform duration-300 rotate-180" />
            )}
          </div>
        </ReactiveButton>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 z-40 h-screen bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-800 transition-all duration-500 ease-in-out transform
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        ${isCollapsed ? 'lg:w-16' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3 transition-all duration-300">
              <div className="h-8 w-8 bg-gradient-to-br from-zinc-100 to-zinc-300 rounded-lg flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                <FileText className="h-5 w-5 text-zinc-900" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold text-zinc-100 tracking-tight animate-fade-in">
                  CareerHub
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ease-in-out group relative overflow-hidden
                    ${isActive 
                      ? 'bg-zinc-100/10 text-zinc-100 border border-zinc-700 transform scale-105' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 hover:scale-105'
                    }
                  `}
                >
                  {/* Animated background */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-zinc-100/5 to-zinc-100/10 transform transition-transform duration-500 ${
                    isActive ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'
                  }`} />
                  
                  <item.icon className={`h-5 w-5 transition-all duration-300 relative z-10 ${
                    isActive ? 'text-zinc-100 scale-110' : 'group-hover:text-zinc-100 group-hover:scale-110'
                  }`} />
                  {!isCollapsed && (
                    <span className="font-medium relative z-10 transition-all duration-300">{item.name}</span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-zinc-100 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 transition-all duration-300 hover:bg-zinc-800/30 rounded-lg p-2">
              <div className="h-8 w-8 bg-zinc-700 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-zinc-600">
                <User className="h-4 w-4 text-zinc-300" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 animate-fade-in">
                  <p className="text-sm font-medium text-zinc-100 truncate">John Doe</p>
                  <p className="text-xs text-zinc-400 truncate">john@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}