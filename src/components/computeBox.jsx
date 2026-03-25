import { useState } from 'react';
import { computeCumax, computeMin, computeRange } from '../data/compute';
import '../styles/compute.css';

function ArrayPreview({ nd }) {
  const shape = Array.from(nd.shape);
  if (nd.ndims === 1) {
    const vals = [];
    for (let i = 0; i < Math.min(nd.shape[0], 12); i++) vals.push(nd.get(i));
    const more = nd.shape[0] > 12;
    return (
      <pre className="preview">
        [{vals.map(v => v.toFixed(3)).join(', ')}{more ? ', ...' : ''}]
      </pre>
    );
  }
  if (nd.ndims === 2) {
    const [rows, cols] = shape;
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) cells.push(nd.get(r, c));
    }
    return (
      <div
        className="grid-preview"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cells.map((v, i) => (
          <div key={i} className="cell">{v.toFixed(3)}</div>
        ))}
      </div>
    );
  }
  return <pre className="preview">Shape: [{shape.join(', ')}]</pre>;
}

export default function ComputeBox({ transformed, setResult }) {
  const [op, setOp] = useState('cumax');
  const [localResult, setLocalResult] = useState(null);
  const [error, setError] = useState('');

  if (!transformed) {
    return (
      <div className="box">
        <h2>Compute</h2>
        <p className="note">Apply a transformation in the previous step first.</p>
      </div>
    );
  }

  const runCompute = () => {
    setError('');
    try {
      let val;
      if (op === 'cumax') val = computeCumax(transformed);
      else if (op === 'min') val = computeMin(transformed);
      else if (op === 'range') val = computeRange(transformed);
      setLocalResult(val);
      setResult({ value: val, operation: op });
    } catch (e) {
      setError(e.message);
    }
  };

  const renderResult = () => {
    if (localResult === null) return null;

    if (op === 'cumax') {
      const preview = localResult.slice(0, 12);
      const more = localResult.length > 12;
      return (
        <div className="section">
          <div className="label">Cumulative maximum</div>
          <pre className="preview">
            [{preview.map(v => v.toFixed(4)).join(', ')}{more ? ', ...' : ''}]
          </pre>
        </div>
      );
    }

    return (
      <div className="section">
        <div className="label">{op} result</div>
        <div className="result-value">{localResult.toFixed(6)}</div>
      </div>
    );
  };

  return (
    <div className="box">
      <h2>Compute</h2>

      <div className="section">
        <div className="label">Input</div>
        <div className="badge">shape: [{Array.from(transformed.shape).join(', ')}]</div>
        <ArrayPreview nd={transformed} />
      </div>

      <div className="panel">
        <div className="row">
          <label>Operation:</label>
          <select
            value={op}
            onChange={e => { setOp(e.target.value); setLocalResult(null); setError(''); }}
          >
            <option value="cumax">cumax</option>
            <option value="min">min (minabs)</option>
            <option value="range">range</option>
          </select>
        </div>
        {error && <div className="error">{error}</div>}
      </div>

      <button className="btn" onClick={runCompute}>
        Run computation
      </button>

      {renderResult()}
    </div>
  );
}
