import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { HomePage } from '@/pages/HomePage';
import { JobSearchPage } from '@/pages/JobSearchPage';
import { ApplicationsPage } from './ApplicationsPage';
import { ProfilePage } from './ProfilePage';
import { CareerChatPage } from './CareerChatPage';
import { ResumeAnalyzerPage } from './ResumeAnalyzerPage';
import { JobRecommendationsPage } from './JobRecommendationsPage';
import { ResumeBuilderPage } from './ResumeBuilderPage';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/job-search" element={<JobSearchPage />} />
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
  );
}