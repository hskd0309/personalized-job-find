import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { ThemeProvider } from './ThemeProvider';
import { HomePage } from '@/pages/HomePage';
import { JobSearchPage } from '@/pages/JobSearchPage';
import { ApplicationsPage } from './ApplicationsPage';
import { ProfilePage } from './ProfilePage';
import { CareerChatPage } from './CareerChatPage';
import { ResumeAnalyzerPage } from './ResumeAnalyzerPage';
import { JobRecommendationsPage } from './JobRecommendationsPageSimple';
import { ResumeBuilderPage } from './ResumeBuilderPage';
import { PersonalizedJobFinder } from './PersonalizedJobFinder';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function AppLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user logs out, redirect to home page
        if (!session?.user) {
          navigate('/');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // If no session, redirect to home page
      if (!session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  // If no user, redirect to home (this shouldn't normally show due to the useEffect)
  if (!user) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
        <div className="flex">
          <AppSidebar />
          <main className="flex-1 min-h-screen transition-all duration-500">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/job-search" element={<JobSearchPage />} />
              <Route path="/personalized-jobs" element={<PersonalizedJobFinder />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/career-chat" element={<CareerChatPage />} />
              <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
              <Route path="/job-recommendations" element={<JobRecommendationsPage />} />
              <Route path="/resume-builder" element={<ResumeBuilderPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}