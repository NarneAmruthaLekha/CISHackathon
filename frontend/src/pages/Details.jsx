import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function Details() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const rawData = localStorage.getItem('scanResult');
    if (!rawData) {
      navigate('/dashboard');
    } else {
      setData(JSON.parse(rawData));
    }
  }, [navigate]);

  if (!data) return null;

  const { target, findings } = data;

  const getBadgeClass = (risk) => {
    if (risk === 'HIGH') return 'badge badge-high';
    if (risk === 'MEDIUM') return 'badge badge-medium';
    return 'badge badge-low';
  };

  return (
    <motion.div 
      className="page-transition-wrapper"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '1.5rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/results')}>
          <ArrowLeft size={18} /> Back to Results
        </button>
        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Detailed Report for <span style={{color: 'var(--accent)'}}>{target}</span></h2>
      </div>

      {findings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <CheckCircle size={80} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{fontSize: '2rem'}}>Target is Secure</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.2rem' }}>No significant vulnerabilities were found during this quick scan iteration.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {findings.map((finding, idx) => (
            <motion.div 
              key={idx} 
              className="glass-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '8px', 
                height: '100%', 
                backgroundColor: finding.risk === 'HIGH' ? 'var(--high-risk)' : finding.risk === 'MEDIUM' ? 'var(--med-risk)' : 'var(--low-risk)'
              }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)', maxWidth: '70%' }}>{finding.type}</h3>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Issue Severity Score: <strong style={{color: 'var(--text-main)'}}>{finding.score}</strong></span>
                  <span className={getBadgeClass(finding.risk)} style={{padding: '0.4rem 1rem', fontSize: '1rem'}}>{finding.risk}</span>
                </div>
              </div>

              <div style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--glass-border)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{color: 'var(--accent)', marginRight: '0.5rem'}}>ℹ️ Note:</span> 
                  This is an individual issue and may not reflect overall system risk
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '3rem', paddingLeft: '1.5rem' }}>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</h4>
                  <p style={{ color: 'var(--text-main)', lineHeight: '1.7', fontSize: '1.05rem' }}>{finding.description}</p>
                  
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', marginTop: '2rem', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Impact</h4>
                  <p style={{ color: 'var(--text-main)', lineHeight: '1.7', fontSize: '1.05rem' }}>{finding.impact}</p>
                </div>
                
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={20} /> Recommended Mitigation
                  </h4>
                  <p style={{ color: 'var(--text-main)', lineHeight: '1.7', fontSize: '1.05rem' }}>{finding.mitigation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
