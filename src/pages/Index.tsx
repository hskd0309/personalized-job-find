import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { JobSearchPage } from '@/pages/JobSearchPage';
import { ApplicationsPage } from '@/components/ApplicationsPage';
import { ProfilePage } from '@/components/ProfilePage';
import { ResumeBuilderPage } from '@/components/ResumeBuilderPage';
import { CompaniesPage } from '@/components/CompaniesPage';
import { CareerChatPage } from '@/components/CareerChatPage';
import { AuthPage } from '@/components/AuthPage';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const Index = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={() => setActiveTab('search')} />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'search':
        return <JobSearchPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'resume':
        return <ResumeBuilderPage />;
      case 'companies':
        return <CompaniesPage />;
      case 'chat':
        return <CareerChatPage />;
      default:
        return <JobSearchPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} user={user} onSignOut={handleSignOut} />
      {renderPage()}
    </div>
  );
};

export default Index;
