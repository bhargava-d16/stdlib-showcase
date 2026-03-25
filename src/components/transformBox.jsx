import { useState } from 'react';
import { expandDims, squeezeNdArray, broadcastNdArray, sliceDim } from '../data/transform';
import '../styles/transform.css';

function getValues(nd) {
  const values = [];
  if (nd.ndims === 1) {
    for (let i = 0; i < nd.shape[0]; i++) values.push(nd.get(i));
  } else if (nd.ndims === 2) {
    for (let r = 0; r < nd.shape[0]; r++) {
      for (let c = 0; c < nd.shape[1]; c++) values.push(nd.get(r, c));
    }
  }
  return values;
}

function Preview({ nd }) {
  const shape = Array.from(nd.shape);
  const values = getValues(nd);

  if (shape.length === 1) {
    const items = values.slice(0, 10);
    const more = values.length > 10;
    return (
      <pre className="preview">
        [{items.map(v => v.toFixed(3)).join(', ')}{more ? ', ...' : ''}]
      </pre>
    );
  }

  if (shape.length === 2) {
    return (
      <div
        className="grid-preview"
        style={{ gridTemplateColumns: `repeat(${shape[1]}, 1fr)` }}
      >
        {values.map((v, i) => (
          <div key={i} className="cell">{v.toFixed(3)}</div>
        ))}
      </div>
    );
  }

  return <pre className="preview">Shape: [{shape.join(', ')}]</pre>;
}

export default function TransformBox({ data, setTransformed }) {
  const [op, setOp] = useState('expand');
  const [axis, setAxis] = useState('0');
  const [shapeInput, setShapeInput] = useState('');
  const [sliceIdx, setSliceIdx] = useState('0');
  const [error, setError] = useState('');
  const [localTransformed, setLocalTransformed] = useState(null);

  if (!data) {
    return (
      <div className="box">
        <h2>Transformations</h2>
        <p className="note">Create an array in the previous step first.</p>
      </div>
    );
  }

  const runTransform = () => {
    setError('');
    try {
      let result;
      if (op === 'expand') {
        const ax = parseInt(axis, 10);
        if (isNaN(ax)) throw new Error('Invalid axis');
        result = expandDims(data, ax);
      } else if (op === 'squeeze') {
        result = squeezeNdArray(data);
      } else if (op === 'broadcast') {
        const shape = shapeInput.split(',').map(s => parseInt(s.trim(), 10));
        if (shape.some(isNaN)) throw new Error('Invalid shape');
        result = broadcastNdArray(data, shape);
      } else if (op === 'slice') {
        const dim = parseInt(axis, 10);
        const idx = parseInt(sliceIdx, 10);
        if (isNaN(dim) || isNaN(idx)) throw new Error('Invalid dim/index');
        result = sliceDim(data, dim, idx);
      }
      setLocalTransformed(result);
      setTransformed(result);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="box">
      <h2>Transformations</h2>

      <div className="section">
        <div className="label">Input</div>
        <div className="badge">shape: [{Array.from(data.shape).join(', ')}]</div>
        <Preview nd={data} />
      </div>

      <div className="panel">
        <div className="row">
          <label>Operation:</label>
          <select value={op} onChange={e => { setOp(e.target.value); setError(''); }}>
            <option value="expand">expand dims</option>
            <option value="squeeze">squeeze</option>
            <option value="broadcast">broadcast</option>
            <option value="slice">slice</option>
          </select>
        </div>

        {op === 'broadcast' && (
          <div className="row">
            <label>Target shape:</label>
            <input
              type="text"
              placeholder="e.g. 2,10"
              value={shapeInput}
              onChange={e => setShapeInput(e.target.value)}
            />
          </div>
        )}

        {(op === 'expand' || op === 'slice') && (
          <div className="row">
            <label>{op === 'expand' ? 'Axis:' : 'Dimension:'}</label>
            <input
              type="number"
              value={axis}
              onChange={e => setAxis(e.target.value)}
            />
          </div>
        )}

        {op === 'slice' && (
          <div className="row">
            <label>Index:</label>
            <input
              type="number"
              value={sliceIdx}
              onChange={e => setSliceIdx(e.target.value)}
            />
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>

      <button className="btn" onClick={runTransform}>
        Apply transform
      </button>

      {localTransformed && (
        <div className="section">
          <div className="label">Output</div>
          <div className="badge">shape: [{Array.from(localTransformed.shape).join(', ')}]</div>
          <Preview nd={localTransformed} />
        </div>
      )}
    </div>
  );
}
