import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Details from './pages/Details';
import History from './pages/History';

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      document.body.className = 'bg-landing';
    } else if (path === '/results' || path === '/details') {
      document.body.className = 'bg-results';
    } else {
      document.body.className = 'bg-dashboard';
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/details" element={<Details />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav>
          <div className="nav-logo">
            <Shield size={24} color="#ec4899" />
            VulnScanner
          </div>
          <div style={{ color: 'var(--text-muted)' }}>Professional Security Assessment</div>
        </nav>
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
