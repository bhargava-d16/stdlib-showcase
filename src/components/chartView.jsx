import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import '../styles/chart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function DistributionChart({ data }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const bins = 20;
  const range = max - min || 1;
  const step = range / bins;

  const counts = new Array(bins).fill(0);
  const labels = [];

  for (let i = 0; i < bins; i++) {
    labels.push((min + i * step).toFixed(2));
  }

  data.forEach(v => {
    let idx = Math.floor((v - min) / step);
    if (idx >= bins) idx = bins - 1;
    counts[idx]++;
  });

  const chartData = {
    labels,
    datasets: [{
      data: counts,
      backgroundColor: '#9ca3af',
      borderWidth: 0,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Data distribution',
        color: '#666',
        font: { size: 14 }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  return (
    <div className="chart-wrapper">
      <Bar data={chartData} options={options} />
    </div>
  );
}

function ValueChart({ data }) {
  const labels = data.map((_, i) => i);

  const chartData = {
    labels,
    datasets: [{
      data,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      pointRadius: 2,
      tension: 0.1,
      fill: true,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Values by index',
        color: '#666',
        font: { size: 14 }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { grid: { color: '#f3f4f6' } }
    }
  };

  return (
    <div className="chart-wrapper">
      <Line data={chartData} options={options} />
    </div>
  );
}

function GridView({ data, shape }) {
  const [rows, cols] = shape;

  return (
    <div className="gridBox">
      <div className="title">2D Array ({rows} × {cols})</div>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {data.map((val, i) => (
          <div key={i} className="cell">
            {typeof val === 'number' ? val.toFixed(3) : val}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartView({ stepIndex, data, array }) {
  if (stepIndex === 0) {
    if (!data || data.length === 0) {
      return (
        <div className="chartBox">
          <div className="placeholder">No data available</div>
        </div>
      );
    }
    return (
      <div className="chartBox">
        <DistributionChart data={data} />
      </div>
    );
  }

  if (stepIndex === 1) {
    if (!array) {
      return (
        <div className="chartBox">
          <div className="placeholder">Create an array to see the visualization.</div>
        </div>
      );
    }

    const shape = Array.from(array.shape);
    const values = [];
    if (shape.length === 1) {
      for (let i = 0; i < shape[0]; i++) values.push(array.get(i));
      return (
        <div className="chartBox">
          <ValueChart data={values} />
        </div>
      );
    }

    if (shape.length === 2) {
      for (let r = 0; r < shape[0]; r++) {
        for (let c = 0; c < shape[1]; c++) values.push(array.get(r, c));
      }
      return (
        <div className="chartBox">
          <GridView data={values} shape={shape} />
        </div>
      );
    }

    return (
      <div className="chartBox">
        <div className="placeholder">Can't visualize {shape.length}D arrays yet.</div>
      </div>
    );
  }

  return (
    <div className="chartBox">
      <div className="placeholder">Chart for step {stepIndex + 1}</div>
    </div>
  );
}
