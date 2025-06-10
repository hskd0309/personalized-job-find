import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { JobSearchPage } from '@/pages/JobSearchPage';
import { ApplicationsPage } from '@/components/ApplicationsPage';
import { ProfilePage } from '@/components/ProfilePage';
import { ResumeBuilderPage } from '@/components/ResumeBuilderPage';
import { CompaniesPage } from '@/components/CompaniesPage';
import { CareerChatPage } from '@/components/CareerChatPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('search');

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
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderPage()}
    </div>
  );
};

export default Index;
