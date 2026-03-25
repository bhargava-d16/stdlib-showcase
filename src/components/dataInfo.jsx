import React from 'react';
import '../styles/info.css';

export default function DataInfo({ array }) {
  if (!array) return null;

  const shape = Array.from(array.shape);
  const strides = Array.from(array.strides);
  const { offset, dtype, length } = array;

  const bufferLabel = dtype === 'float64'
    ? `Float64Array(${length})`
    : dtype === 'int32'
    ? `Int32Array(${length})`
    : `Buffer(${length})`;

  return (
    <div className="dataBox">
      <h3>Array details</h3>
      <div className="row">
        <span className="key">Shape:</span>
        <span className="val">[{shape.join(', ')}]</span>
      </div>
      <div className="row">
        <span className="key">Strides:</span>
        <span className="val">[{strides.join(', ')}]</span>
      </div>
      <div className="row">
        <span className="key">Offset:</span>
        <span className="val">{offset}</span>
      </div>
      <div className="row">
        <span className="key">Buffer:</span>
        <span className="val">{bufferLabel}</span>
      </div>
      <div className="row">
        <span className="key">Data type:</span>
        <span className="val">{dtype}</span>
      </div>
    </div>
  );
}
