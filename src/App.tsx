import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Index } from '@/pages/Index';
import { AppLayout } from '@/components/AppLayout';
import { AuthPage } from '@/components/AuthPage';
import NotFound from '@/pages/NotFound';

// New Reactive Resume styled pages
import { ReactiveNavbar } from '@/components/layout/ReactiveNavbar';
import { ReactiveLandingPage } from '@/pages/ReactiveLandingPage';
import { ReactiveAnalyzerPage } from '@/pages/ReactiveAnalyzerPage';
import { ReactiveJobDashboard } from '@/pages/ReactiveJobDashboard';
import { ReactiveProfilePage } from '@/pages/ReactiveProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage onAuthSuccess={() => window.location.href = '/'} />} />
        
        {/* New Reactive Resume styled routes */}
        <Route path="/reactive/*" element={
          <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
            <ReactiveNavbar />
            <Routes>
              <Route path="/" element={<ReactiveLandingPage />} />
              <Route path="/analyzer" element={<ReactiveAnalyzerPage />} />
              <Route path="/jobs" element={<ReactiveJobDashboard />} />
              <Route path="/profile" element={<ReactiveProfilePage />} />
            </Routes>
          </div>
        } />
        
        <Route path="/app/*" element={<AppLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;