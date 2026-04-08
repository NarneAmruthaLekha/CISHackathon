import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="page-transition-wrapper"
      style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '80vh' }}
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="glass-panel" style={{ maxWidth: '650px', width: '100%', padding: '4rem 2rem' }}>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Shield size={80} color="var(--accent)" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))' }} />
        </motion.div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', letterSpacing: '-1px' }}>
          VulnScanner
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
          Comprehensive Web Vulnerability Detection & Security Assessment Dashboard
        </p>
        
        <button 
          className="btn-primary" 
          onClick={() => navigate('/dashboard')}
          style={{ fontSize: '1.2rem', padding: '1.25rem 2.5rem', borderRadius: '12px' }}
        >
          Start Checking <ArrowRight size={24} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
    </motion.div>
  );
}
