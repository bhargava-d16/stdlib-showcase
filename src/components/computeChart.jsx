import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/compute.css';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function getFlat(nd) {
  const vals = [];
  if (nd.ndims === 1) {
    for (let i = 0; i < nd.shape[0]; i++) vals.push(nd.get(i));
  } else if (nd.ndims === 2) {
    for (let r = 0; r < nd.shape[0]; r++) {
      for (let c = 0; c < nd.shape[1]; c++) vals.push(nd.get(r, c));
    }
  }
  return vals;
}

const baseOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: true, text: title, color: '#666', font: { size: 13 } }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 9 } } },
    y: { ticks: { font: { size: 9 } } }
  }
});

function CumaxChart({ original, values }) {
  const chartData = {
    labels: original.map((_, i) => i),
    datasets: [
      {
        label: 'Original',
        data: original,
        borderColor: '#9ca3af',
        pointRadius: 2,
        tension: 0.1,
        fill: false,
      },
      {
        label: 'cumax',
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        pointRadius: 2,
        tension: 0,
        stepped: true,
        fill: true,
      }
    ]
  };
  return (
    <div className="chart-wrapper">
      <Line data={chartData} options={baseOptions('Cumulative maximum')} />
    </div>
  );
}

function MinChart({ original, value }) {
  const minIdx = original.indexOf(Math.min(...original));
  const chartData = {
    labels: original.map((_, i) => i),
    datasets: [{
      label: 'Values',
      data: original,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.1)',
      pointBackgroundColor: original.map((_, i) => i === minIdx ? '#ef4444' : 'rgba(59,130,246,0.5)'),
      pointRadius: original.map((_, i) => i === minIdx ? 6 : 2),
      tension: 0.1,
      fill: true,
    }]
  };

  return (
    <div className="chart-wrapper col">
      <div className="badge">min (minabs) = {value.toFixed(6)}</div>
      <div className="chart-container">
        <Line data={chartData} options={baseOptions('Minimum value highlight')} />
      </div>
    </div>
  );
}

function RangeChart({ original, value }) {
  const min = Math.min(...original);
  const max = Math.max(...original);
  const minIdx = original.indexOf(min);
  const maxIdx = original.indexOf(max);

  const chartData = {
    labels: original.map((_, i) => i),
    datasets: [{
      label: 'Values',
      data: original,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.05)',
      pointBackgroundColor: original.map((_, i) => {
        if (i === minIdx) return '#ef4444';
        if (i === maxIdx) return '#22c55e';
        return 'rgba(59,130,246,0.5)';
      }),
      pointRadius: original.map((_, i) => i === minIdx || i === maxIdx ? 6 : 2),
      tension: 0.1,
      fill: true,
    }]
  };

  return (
    <div className="chart-wrapper col">
      <div className="badge-row">
        <span className="badge" style={{ color: '#ef4444' }}>min: {min.toFixed(4)}</span>
        <span className="badge" style={{ color: '#22c55e' }}>max: {max.toFixed(4)}</span>
        <span className="badge">range: {value.toFixed(4)}</span>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={baseOptions('Range: min → max')} />
      </div>
    </div>
  );
}

export default function ComputeChart({ input, result }) {
  if (!input) {
    return (
      <div className="chartBox">
        <div className="placeholder">Apply a transformation in the previous step first.</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="chartBox">
        <div className="placeholder">Run a computation to see the chart.</div>
      </div>
    );
  }

  const values = getFlat(input);

  if (result.operation === 'cumax') {
    return (
      <div className="chartBox">
        <CumaxChart original={values} values={result.value} />
      </div>
    );
  }

  if (result.operation === 'min') {
    return (
      <div className="chartBox">
        <MinChart original={values} value={result.value} />
      </div>
    );
  }

  if (result.operation === 'range') {
    return (
      <div className="chartBox">
        <RangeChart original={values} value={result.value} />
      </div>
    );
  }

  return (
    <div className="chartBox">
      <div className="placeholder">No chart for this operation.</div>
    </div>
  );
}
