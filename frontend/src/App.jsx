import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Details from './pages/Details';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav>
          <div className="nav-logo">
            <Shield size={24} color="#3b82f6" />
            VulnScanner
          </div>
          <div style={{ color: 'var(--text-muted)' }}>Professional Security Assessment</div>
        </nav>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/details" element={<Details />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
