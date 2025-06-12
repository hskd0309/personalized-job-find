import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Index } from '@/pages/Index';
import { AppLayout } from '@/components/AppLayout';
import { AuthPage } from '@/components/AuthPage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage onAuthSuccess={() => window.location.href = '/'} />} />
        <Route path="/app/*" element={<AppLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;