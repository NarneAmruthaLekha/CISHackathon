import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyStats, setHistoryStats] = useState({ high: 0, medium: 0, low: 0, total: 0, grouped: { HIGH: [], MEDIUM: [], LOW: [] } });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/auth');
    }
    
    // Load local history stats
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    const stats = { high: 0, medium: 0, low: 0, total: history.length, grouped: { HIGH: [], MEDIUM: [], LOW: [] } };
    
    history.forEach(scan => {
      const urlStr = scan.url || 'Unknown';
      if (scan.overall === 'HIGH') {
        stats.high++;
        if(!stats.grouped.HIGH.includes(urlStr)) stats.grouped.HIGH.push(urlStr);
      }
      else if (scan.overall === 'MEDIUM') {
        stats.medium++;
        if(!stats.grouped.MEDIUM.includes(urlStr)) stats.grouped.MEDIUM.push(urlStr);
      }
      else if (scan.overall === 'LOW') {
        stats.low++;
        if(!stats.grouped.LOW.includes(urlStr)) stats.grouped.LOW.push(urlStr);
      }
    });
    
    setHistoryStats(stats);
  }, [navigate]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!target) return;

    localStorage.removeItem('scanResult');
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target })
      });

      if (!response.ok) {
        throw new Error('Scan failed. Ensure the Flask backend is running on port 5000.');
      }

      const data = await response.json();
      console.log("SCAN RESPONSE:", data);
      
      navigate('/results', { state: { ...data, inputUrl: target } });
    } catch (err) {
      setError(err.message || 'Error occurred during scan.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <motion.div 
      className="page-transition-wrapper"
      style={{ alignItems: 'center', justifyContent: 'center' }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', display: 'flex', gap: '1rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/history')}>View History</button>
        <button className="btn-secondary" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', textAlign: 'center' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <Search size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h2>New Scan</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Enter a URL, IP, or Domain to assess its vulnerabilities.</p>
        </div>

        {error && <div style={{ color: 'var(--high-risk)', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</div>}

        <form onSubmit={handleScan} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <input 
            type="text" 
            className="input-field" 
            style={{ padding: '1.25rem', fontSize: '1.1rem' }}
            placeholder="e.g. https://example.com"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '1.25rem', fontSize: '1.1rem' }}>
            {loading ? <Loader2 className="lucide-spin" size={24} /> : 'Run Background Scanner'}
          </button>
        </form>

        {loading && (
          <div style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
            <p>Analyzing target... Running active, non-destructive checks.</p>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', marginTop: '2rem' }}>
        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>Scan Analytics</h3>
        
        {historyStats.total === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No scan history yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="tooltip-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
              <span style={{ width: '80px', color: 'var(--text-muted)' }}>HIGH</span>
              <div style={{ flex: 1, backgroundColor: 'var(--glass-bg)', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(historyStats.high / historyStats.total) * 100}%`, height: '100%', backgroundColor: 'var(--high-risk)' }}></div>
              </div>
              <span style={{ width: '30px', textAlign: 'right', fontWeight: 'bold', color: 'var(--high-risk)' }}>{historyStats.high}</span>
              
              {historyStats.grouped.HIGH.length > 0 && (
                <div className="custom-tooltip">
                  <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--high-risk)' }}>HIGH:</div>
                  {historyStats.grouped.HIGH.map((u, i) => <div key={i}>• {u}</div>)}
                </div>
              )}
            </div>
            
            <div className="tooltip-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
              <span style={{ width: '80px', color: 'var(--text-muted)' }}>MEDIUM</span>
              <div style={{ flex: 1, backgroundColor: 'var(--glass-bg)', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(historyStats.medium / historyStats.total) * 100}%`, height: '100%', backgroundColor: 'var(--med-risk)' }}></div>
              </div>
              <span style={{ width: '30px', textAlign: 'right', fontWeight: 'bold', color: 'var(--med-risk)' }}>{historyStats.medium}</span>
              
              {historyStats.grouped.MEDIUM.length > 0 && (
                <div className="custom-tooltip">
                  <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--med-risk)' }}>MEDIUM:</div>
                  {historyStats.grouped.MEDIUM.map((u, i) => <div key={i}>• {u}</div>)}
                </div>
              )}
            </div>
            
            <div className="tooltip-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
              <span style={{ width: '80px', color: 'var(--text-muted)' }}>LOW</span>
              <div style={{ flex: 1, backgroundColor: 'var(--glass-bg)', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(historyStats.low / historyStats.total) * 100}%`, height: '100%', backgroundColor: 'var(--low-risk)' }}></div>
              </div>
              <span style={{ width: '30px', textAlign: 'right', fontWeight: 'bold', color: 'var(--low-risk)' }}>{historyStats.low}</span>
              
              {historyStats.grouped.LOW.length > 0 && (
                <div className="custom-tooltip">
                  <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--low-risk)' }}>LOW:</div>
                  {historyStats.grouped.LOW.map((u, i) => <div key={i}>• {u}</div>)}
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
      
      <style>{`
        .lucide-spin { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .tooltip-container {
          position: relative;
        }
        
        .custom-tooltip {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          z-index: 10;
          bottom: 120%;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--panel-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          padding: 10px 14px;
          border-radius: 8px;
          white-space: nowrap;
          font-size: 0.85rem;
          transition: opacity 0.3s, bottom 0.3s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
          pointer-events: none;
        }
        
        .tooltip-container:hover .custom-tooltip {
          visibility: visible;
          opacity: 1;
          bottom: 110%;
        }
      `}</style>
    </motion.div>
  );
}
