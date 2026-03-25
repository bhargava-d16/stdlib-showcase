import React from 'react';
import '../styles/pipeline.css';

const STEPS = ["Raw Data", "ndarray", "Transform", "Compute", "Analyze"];

export default function Pipeline({ activeStep, onStepChange }) {
  return (
    <div className="pipeline">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step}>
          <div 
            className={`step-dot ${activeStep === idx ? 'active' : ''}`}
            onClick={() => onStepChange(idx)}
          >
            {step}
          </div>
          {idx < STEPS.length - 1 && (
            <div className="arrow">→</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
