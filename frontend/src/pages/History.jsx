import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    setHistory(data);
  }, []);

  const getBadgeClass = (risk) => {
    if (risk === 'HIGH') return 'badge badge-high';
    if (risk === 'MEDIUM') return 'badge badge-medium';
    return 'badge badge-low';
  };

  const handleDownload = () => {
    if (history.length === 0) return;
    
    // Create CSV header
    let csvContent = "URL,Risk Level,Score,Date\n";
    
    // Append rows
    history.forEach(scan => {
      const row = `${scan.url},${scan.overall},${scan.score},${new Date(scan.date).toLocaleString()}`;
      csvContent += row + "\n";
    });
    
    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "scan_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      className="page-transition-wrapper"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <button className="btn-primary" onClick={handleDownload} disabled={history.length === 0}>
          <Download size={18} /> Download CSV
        </button>
      </div>

      <div className="glass-panel">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Scan History</h2>
        
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No scan history yet
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', fontWeight: 500 }}>URL</th>
                  <th style={{ padding: '1rem', fontWeight: 500 }}>Risk Level</th>
                  <th style={{ padding: '1rem', fontWeight: 500 }}>Score</th>
                  <th style={{ padding: '1rem', fontWeight: 500 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((scan, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-main)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {scan.url}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={getBadgeClass(scan.overall)}>{scan.overall}</span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
                      {scan.score} / 10
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {new Date(scan.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
