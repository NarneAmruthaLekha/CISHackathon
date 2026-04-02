import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.includes('@gmail.com')) {
      setError('Email must be a valid @gmail.com address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    localStorage.setItem('user', JSON.stringify({ email }));
    navigate('/dashboard');
  };

  const handleGoogle = () => {
    localStorage.setItem('user', JSON.stringify({ email: 'user@gmail.com' }));
    navigate('/dashboard');
  };

  return (
    <motion.div 
      className="page-transition-wrapper"
      style={{ alignItems: 'center', justifyContent: 'center' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldAlert size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h2>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Sign in to access scanner tools</p>
        </div>
        
        {error && <div style={{ color: 'var(--high-risk)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label className="label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            Sign In
          </button>
        </form>
        
        <div style={{ margin: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>— OR —</div>
        
        <button type="button" className="btn-secondary" style={{ width: '100%' }} onClick={handleGoogle}>
          <svg style={{ width: 18, marginRight: 8 }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M11.99 13.9v-3.72h9.36c.14.73.22 1.5.22 2.32 0 2.76-.92 5.15-2.5 6.94-1.63 1.83-3.95 2.95-6.84 2.95-3.36 0-6.19-2.22-7.25-5.26-.26-.74-.41-1.54-.41-2.37s.15-1.63.41-2.37c1.06-3.04 3.89-5.26 7.25-5.26 1.9 0 3.65.65 5.06 1.96l-2.68 2.68c-.68-.65-1.68-1.12-2.92-1.12-2.24 0-4.14 1.51-4.82 3.55-.17.51-.27 1.05-.27 1.62s.1 1.11.27 1.62c.68 2.04 2.58 3.55 4.82 3.55 1.54 0 2.87-.51 3.84-1.39.81-.74 1.28-1.78 1.43-2.91h-5.9z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </motion.div>
  );
}
