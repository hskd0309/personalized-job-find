import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { HomePage } from '@/pages/HomePage';
import { JobSearchPage } from '@/pages/JobSearchPage';
import { ApplicationsPage } from '@/components/ApplicationsPage';
import { ProfilePage } from '@/components/ProfilePage';
import { ResumeBuilderPage } from '@/components/ResumeBuilderPage';
import { CompaniesPage } from '@/components/CompaniesPage';
import { CareerChatPage } from '@/components/CareerChatPage';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export function AppLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate('/auth');
      }
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <AppSidebar />
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <div className="p-4">
            <SidebarTrigger className="animate-fade-in" />
          </div>
          <div className="px-6 pb-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/job-search" element={<JobSearchPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/resume-builder" element={<ResumeBuilderPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/career-chat" element={<CareerChatPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}