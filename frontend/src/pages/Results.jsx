import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state || {};

  console.log("Scan Result:", result);

  const target = result?.inputUrl || result?.target || "Unknown Target";
  const overall = result?.overall || result?.overall_risk || "LOW";
  const score = result?.score || 0;
  const findings = result?.findings || [];

  useEffect(() => {
    if (Object.keys(result).length > 0) {
      const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
      const newEntry = {
        url: target,
        overall: overall,
        score: score,
        findings: findings,
        date: new Date().toLocaleString()
      };
      
      const existingIdx = history.findIndex(h => h.url === target);
      if (existingIdx >= 0) {
        history[existingIdx] = newEntry;
      } else {
        history.push(newEntry);
      }
      
      localStorage.setItem('scanHistory', JSON.stringify(history));
    }
  }, [result, target, overall, score, findings]);

  if (!result || Object.keys(result).length === 0) {
    return (
      <div style={{ color: "var(--text-main)", textAlign: "center", padding: "5rem" }}>
        <h2>No results available</h2>
        <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem' }}>Back to Dashboard</button>
      </div>
    );
  }

  const getRiskColor = (risk) => {
    if (risk === 'HIGH') return 'var(--high-risk)';
    if (risk === 'MEDIUM') return 'var(--med-risk)';
    return 'var(--low-risk)';
  };

  const highCount = findings.filter(f => f.severity === "HIGH" || f.risk === "HIGH").length || 0;
  const mediumCount = findings.filter(f => f.severity === "MEDIUM" || f.risk === "MEDIUM").length || 0;
  const lowCount = findings.filter(f => f.severity === "LOW" || f.risk === "LOW").length || 0;
  
  const pieData = [
    { name: 'High', value: highCount },
    { name: 'Medium', value: mediumCount },
    { name: 'Low', value: lowCount },
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
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} /> New Scan
        </button>
        <button className="btn-primary" onClick={() => navigate('/details', { state: result })}>
          View Details <ArrowRight size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Risk Level</h3>
          <div style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            color: overall === 'SECURE' ? 'var(--accent)' : getRiskColor(overall),
            marginBottom: '1.5rem',
            lineHeight: 1
          }}>
            {overall}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
            {score >= 8 ? <ShieldCheck color="var(--accent)" size={32} /> : <ShieldAlert color={getRiskColor(overall)} size={32}/>}
            <span>System Score: <strong>{score} / 10</strong></span>
          </div>

          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', maxWidth: '80%', lineHeight: '1.4' }}>
            {overall === 'LOW' && "Overall risk is low because only minor or isolated issues were found."}
            {overall === 'MEDIUM' && "Multiple moderate issues detected."}
            {overall === 'HIGH' && "Critical vulnerabilities detected. Immediate action required."}
            {overall === 'SECURE' && "No issues detected. System is completely secure."}
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
            <span className="badge badge-high">High: {highCount}</span>
            <span className="badge badge-medium">Medium: {mediumCount}</span>
            <span className="badge badge-low">Low: {lowCount}</span>
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
