import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { Index } from '@/pages/Index';
import { JobSearchPage } from '@/pages/JobSearchPage';
import { ApplicationsPage } from '@/components/ApplicationsPage';
import { ProfilePage } from '@/components/ProfilePage';
import { ResumeBuilderPage } from '@/components/ResumeBuilderPage';
import { CompaniesPage } from '@/components/CompaniesPage';
import { CareerChatPage } from '@/components/CareerChatPage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1">
            <div className="p-4">
              <SidebarTrigger />
            </div>
            <div className="px-6 pb-6">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/job-search" element={<JobSearchPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/resume-builder" element={<ResumeBuilderPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/career-chat" element={<CareerChatPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </Router>
  );
}

export default App;