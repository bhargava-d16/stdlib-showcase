import { useState } from 'react';
import { runAnalysis as analyze } from '../data/analyze';
import '../styles/analyze.css';

function InputPreview({ result }) {
  if (!result) return null;

  if (Array.isArray(result.value)) {
    const vals = result.value;
    const preview = vals.slice(0, 12);
    const more = vals.length > 12;
    return (
      <pre className="preview">
        [{preview.map(v => v.toFixed(4)).join(', ')}{more ? ', ...' : ''}]
      </pre>
    );
  }

  return (
    <div className="scalar-preview">
      {result.value.toFixed(6)}
    </div>
  );
}

function StatItem({ label, value, desc }) {
  return (
    <div className="stat-item">
      <div className="header">
        <span className="name">{label}</span>
        <span className="desc">{desc}</span>
      </div>
      <span className="val">{typeof value === 'number' ? value.toFixed(6) : '—'}</span>
    </div>
  );
}

export default function AnalyzeBox({ result, setStats }) {
  const [localStats, setLocalStats] = useState(null);
  const [error, setError] = useState('');

  if (!result) {
    return (
      <div className="box">
        <h2>Analysis</h2>
        <p className="note">Run a computation in the previous step first.</p>
      </div>
    );
  }

  const runAnalysis = () => {
    setError('');
    try {
      const stats = analyze(result);
      setLocalStats(stats);
      setStats(stats);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="box">
      <h2>Analysis</h2>

      <div className="section">
        <div className="label">Input ({result.operation})</div>
        <InputPreview result={result} />
      </div>

      <button className="btn" onClick={runAnalysis}>Analyze data</button>

      {error && <div className="error">{error}</div>}

      {localStats && (
        <div className="stats-list">
          <StatItem label="Mean" value={localStats.mean} desc="center of data" />
          <StatItem label="Median" value={localStats.median} desc="middle value" />
          <StatItem label="Variance" value={localStats.variance} desc="spread of values" />
          <StatItem label="Std Dev" value={localStats.stdDev} desc="average deviation" />
        </div>
      )}
    </div>
  );
}
