import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Results() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const rawData = localStorage.getItem('scanResult');
    if (!rawData) {
      navigate('/dashboard');
      const parsedData = JSON.parse(rawData);
      setData(parsedData);

      const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
      const newEntry = {
        url: parsedData.target,
        overall: parsedData.overall_risk,
        score: parsedData.score,
        findings: parsedData.findings,
        date: parsedData.timestamp || new Date().toISOString()
      };
      
      if (history.length === 0 || history[0].date !== newEntry.date) {
        history.unshift(newEntry);
        localStorage.setItem('scanHistory', JSON.stringify(history));
      }
    }
  }, [navigate]);

  if (!data) return null;

  const { target, overall_risk, score, findings } = data;

  const getRiskColor = (risk) => {
    if (risk === 'HIGH') return 'var(--high-risk)';
    if (risk === 'MEDIUM') return 'var(--med-risk)';
    return 'var(--low-risk)';
  };

  const pieData = [
    { name: 'High', value: findings.filter(f => f.risk === 'HIGH').length },
    { name: 'Medium', value: findings.filter(f => f.risk === 'MEDIUM').length },
    { name: 'Low', value: findings.filter(f => f.risk === 'LOW').length },
  ].filter(d => d.value > 0);

  const getPieColor = (name) => {
    if(name === 'High') return 'var(--high-risk)';
    if(name === 'Medium') return 'var(--med-risk)';
    return 'var(--low-risk)';
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let exp = "Minor or no issues. System is mostly secure.";
      if (data.name === 'High') exp = "Critical vulnerabilities detected. Immediate action required.";
      if (data.name === 'Medium') exp = "Moderate issues found. Should be addressed soon.";

      return (
        <div style={{ backgroundColor: 'var(--panel-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '8px', maxWidth: '250px' }}>
          <h4 style={{ color: getPieColor(data.name), marginBottom: '0.4rem', fontSize: '1.1rem' }}>Risk Level: {data.name} Risk</h4>
          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontWeight: 'bold' }}>Number of findings: {data.value}</p>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>{exp}</p>
        </div>
      );
    }
    return null;
  };

  const barData = findings.map((f, i) => ({
    name: `Finding ${i+1}`,
    score: f.score,
    risk: f.risk
  }));

  return (
    <motion.div 
      className="page-transition-wrapper"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} /> New Scan
        </button>
        <button className="btn-primary" onClick={() => navigate('/details')}>
          View Details <ArrowRight size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Risk Level</h3>
          <div style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            color: overall_risk === 'SECURE' ? 'var(--accent)' : getRiskColor(overall_risk),
            marginBottom: '1.5rem',
            lineHeight: 1
          }}>
            {overall_risk}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
            {score >= 8 ? <ShieldCheck color="var(--accent)" size={32} /> : <ShieldAlert color={getRiskColor(overall_risk)} size={32}/>}
            <span>System Score: <strong>{score} / 10</strong></span>
          </div>

          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', maxWidth: '80%', lineHeight: '1.4' }}>
            {overall_risk === 'LOW' && "Overall risk is low because only minor or isolated issues were found."}
            {overall_risk === 'MEDIUM' && "Multiple moderate issues detected."}
            {overall_risk === 'HIGH' && "Critical vulnerabilities detected. Immediate action required."}
            {overall_risk === 'SECURE' && "No issues detected. System is completely secure."}
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
            <span className="badge badge-high">High: {findings.filter(f => f.risk === 'HIGH').length}</span>
            <span className="badge badge-medium">Medium: {findings.filter(f => f.risk === 'MEDIUM').length}</span>
            <span className="badge badge-low">Low: {findings.filter(f => f.risk === 'LOW').length}</span>
          </div>

          <p style={{ marginTop: '2rem', color: 'var(--text-muted)', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>Target: {target}</p>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.4rem' }}>Vulnerability Distribution</h3>
          {findings.length === 0 ? (
            <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.2rem' }}>
              No vulnerabilities detected. Target is secure.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '400px', gap: '2rem' }}>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getPieColor(entry.name)} style={{ outline: 'none', transition: 'all 0.3s ease' }} className="pie-cell-hover" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} cursor={{fill: 'transparent'}} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{value} Risk</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .pie-cell-hover:hover {
          filter: brightness(1.2);
          transform: scale(1.02);
          transform-origin: center;
        }
      `}</style>
    </motion.div>
  );
}
