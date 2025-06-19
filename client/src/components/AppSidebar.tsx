import React, { useState, useEffect } from 'react';
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
import { SettingsModal } from './SettingsModal';
import { CareerHubIcon } from './CareerHubIcon';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Job Search', href: '/app/job-search', icon: Search },
    { name: 'Personalized Jobs', href: '/app/personalized-jobs', icon: PlusCircle },
    { name: 'Applications', href: '/app/applications', icon: Briefcase },
    { name: 'Resume Builder', href: '/app/resume-builder', icon: FileText },
    { name: 'Resume Analyzer', href: '/app/resume-analyzer', icon: BarChart3 },
    { name: 'Job Recommendations', href: '/app/job-recommendations', icon: BarChart3 },
    { name: 'Career Chat', href: '/app/career-chat', icon: MessageSquare },
    { name: 'Profile', href: '/app/profile', icon: User },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get user data from auth user metadata and profile table
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('user_id', user.id)
            .single();

          setUserProfile({
            first_name: profile?.first_name || user.user_metadata?.first_name || '',
            last_name: profile?.last_name || user.user_metadata?.last_name || '',
            email: profile?.email || user.email || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <ReactiveButton
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="transition-all duration-300 hover:scale-110 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-300 dark:border-zinc-700"
        >
          <div className="relative">
            {isCollapsed ? (
              <Menu className="h-5 w-5 transition-transform duration-300 rotate-0 text-zinc-700 dark:text-zinc-300" />
            ) : (
              <X className="h-5 w-5 transition-transform duration-300 rotate-180 text-zinc-700 dark:text-zinc-300" />
            )}
          </div>
        </ReactiveButton>
      </div>

      {/* Desktop Close Button - positioned to not overlap with brand icon */}
      <div className={`hidden lg:block fixed top-6 z-50 transition-all duration-500 ${
        isCollapsed ? 'left-20' : 'left-[17.5rem]'
      }`}>
        <ReactiveButton
          variant="ghost" 
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="transition-all duration-300 hover:scale-110 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-300 dark:border-zinc-700 rounded-full p-2"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          ) : (
            <X className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          )}
        </ReactiveButton>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800/30 transition-all duration-500 ease-in-out transform
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        ${isCollapsed ? 'lg:w-16' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 transition-all duration-300">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110 shadow-lg">
                <CareerHubIcon size={24} className="text-white" />
              </div>
              {!isCollapsed && (
                <div className="animate-fade-in">
                  <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">CareerHub</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">AI Career Platform</p>
                </div>
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
                      ? 'bg-zinc-200/80 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'
                    }
                  `}
                >
                  {/* Animated background for hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-zinc-700/20 to-zinc-600/20 transform transition-transform duration-500 ${
                    isActive ? 'translate-x-0 opacity-100' : '-translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100'
                  }`} />
                  
                  <item.icon className={`h-5 w-5 transition-all duration-300 relative z-10 ${
                    isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'
                  }`} />
                  {!isCollapsed && (
                    <span className={`font-medium relative z-10 transition-all duration-300 ${
                      isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'
                    }`}>{item.name}</span>
                  )}
                  
                  {/* Active indicator - subtle dot */}
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-1.5 bg-zinc-600 dark:bg-zinc-300 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div 
              className="flex items-center gap-3 transition-all duration-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 rounded-lg p-2 cursor-pointer"
              onClick={() => setIsSettingsOpen(true)}
            >
              <div className="h-8 w-8 bg-zinc-300 dark:bg-zinc-700 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-zinc-400 dark:hover:bg-zinc-600">
                <User className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 animate-fade-in">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {userProfile ? `${userProfile.first_name} ${userProfile.last_name}`.trim() || 'User' : 'Loading...'}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                    {userProfile?.email || 'Loading...'}
                  </p>
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
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}