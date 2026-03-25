import { useState } from 'react';
import { convertToNdArray } from '../data/convert';
import '../styles/box.css';

function formatGrid(data, shape) {
  if (!shape || shape.length === 1) {
    return '[' + data.map(v => v.toFixed(4)).join(', ') + ']';
  }
  const cols = shape[1];
  const rows = [];
  for (let r = 0; r < shape[0]; r++) {
    const row = data.slice(r * cols, r * cols + cols).map(v => v.toFixed(4));
    rows.push('  [' + row.join(', ') + ']');
  }
  return '[\n' + rows.join(',\n') + '\n]';
}

function parseShape(input, length) {
  const clean = input.replace(/[\[\]]/g, '').trim();
  const parts = clean.split(',').map(s => parseInt(s.trim(), 10));
  if (parts.some(isNaN) || parts.some(n => n <= 0)) return null;
  const total = parts.reduce((a, b) => a * b, 1);
  return total === length ? parts : null;
}

export default function GenerateBox({ stepIndex, data, reset, setRaw, setArray }) {
  const [size, setSize] = useState(10);
  const [customText, setCustomText] = useState('');
  const [shapeText, setShapeText] = useState('');
  const [dtype, setDtype] = useState('float64');
  const [error, setError] = useState('');
  const [localArray, setLocalArray] = useState(null);

  const generate = () => {
    reset(size);
    setLocalArray(null);
  };

  const applyCustom = () => {
    if (!customText.trim()) return;
    const parsed = customText.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      setRaw(parsed);
      setLocalArray(null);
    }
    setCustomText('');
  };

  const createArray = () => {
    const raw = shapeText.trim() === '' ? `[${data.length}]` : shapeText;
    const shape = parseShape(raw, data.length);
    if (!shape) {
      setError(`Shape must multiply to ${data.length}.`);
      return;
    }
    setError('');
    try {
      const result = convertToNdArray(data, shape);
      setLocalArray({ nd: result, shape });
      setArray(result);
    } catch (e) {
      setError(e.message);
    }
  };

  if (stepIndex === 0) {
    return (
      <div className="box">
        <h2>Raw data</h2>

        <div className="row">
          <label>Size:</label>
          <input
            type="number"
            value={size}
            onChange={e => setSize(parseInt(e.target.value) || 1)}
            min="1"
          />
          <button onClick={generate}>Generate</button>
        </div>

        <div className="row col">
          <label className="sub-label">Or provide custom data:</label>
          <textarea
            placeholder="e.g. 1.2, 3.4, 5.6"
            value={customText}
            onChange={e => setCustomText(e.target.value)}
          />
          <button onClick={applyCustom}>Apply</button>
        </div>

        <div className="banner">
          randn() → shuffle()
        </div>

        <div className="section">
          <div className="label">Output data</div>
          <pre className="preview">
            {`[\n${data.map(d => `  ${d},`).join('\n')}\n]`}
          </pre>
        </div>
      </div>
    );
  }

  if (stepIndex === 1) {
    const previewData = data.slice(0, 20);
    const hasMore = data.length > 20;

    return (
      <div className="box">
        <h2>Array settings</h2>

        <div className="section">
          <div className="label">Input data (from step 1)</div>
          <pre className="preview">
            [{previewData.map(v => v.toFixed(4)).join(', ')}{hasMore ? ', ...' : ''}]
          </pre>
        </div>

        <div className="panel">
          <div className="row">
            <label>Shape:</label>
            <input
              type="text"
              placeholder={`[${data.length}]`}
              value={shapeText}
              onChange={e => { setShapeText(e.target.value); setError(''); }}
            />
          </div>
          <div className="row">
            <label>Type:</label>
            <select value={dtype} onChange={e => setDtype(e.target.value)}>
              <option value="float64">float64</option>
              <option value="int32">int32</option>
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="note">
            Strides and offset are computed automatically.
          </div>
        </div>

        <button className="btn" onClick={createArray}>
          Create array
        </button>

        {localArray && (
          <div className="section">
            <div className="label">Structured array</div>
            <pre className="preview">
              {formatGrid(data, localArray.shape)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return null;
}
