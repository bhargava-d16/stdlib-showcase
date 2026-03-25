import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/transform.css';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function extractFlat(nd) {
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

function SmallChart({ values, color }) {
  const chartData = {
    labels: values.map((_, i) => i),
    datasets: [{
      data: values,
      borderColor: color,
      backgroundColor: color + '22',
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
      title: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 } } },
      y: { ticks: { font: { size: 9 } } }
    }
  };

  return (
    <div className="mini-chart">
      <Line data={chartData} options={options} />
    </div>
  );
}

function GridPanel({ nd, title }) {
  const shape = Array.from(nd.shape);
  const flat = extractFlat(nd);
  const cols = shape.length >= 2 ? shape[shape.length - 1] : shape[0];

  return (
    <div className="panel">
      <div className="panel-title">{title}</div>
      <div className="badge">shape: [{shape.join(', ')}]</div>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {flat.map((v, i) => (
          <div key={i} className="cell">
            {typeof v === 'number' ? v.toFixed(3) : v}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TransformChart({ input, output }) {
  if (!input) {
    return (
      <div className="chartBox">
        <div className="placeholder">Create an array in the previous step first.</div>
      </div>
    );
  }

  if (!output) {
    return (
      <div className="chartBox">
        <div className="placeholder">Apply a transform to see before → after comparison.</div>
      </div>
    );
  }

  const inShape = Array.from(input.shape);
  const outShape = Array.from(output.shape);

  if (input.ndims === 1 && output.ndims === 1) {
    return (
      <div className="chartBox col">
        <div className="transition-label">
          [{inShape.join(', ')}] → [{outShape.join(', ')}]
        </div>
        <div className="chart-row">
          <div className="section">
            <div className="label">Before</div>
            <SmallChart values={extractFlat(input)} color="#9ca3af" />
          </div>
          <div className="section">
            <div className="label">After</div>
            <SmallChart values={extractFlat(output)} color="#3b82f6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chartBox">
      <div className="comparison">
        <GridPanel nd={input} title="Before" />
        <div className="arrow">→</div>
        <GridPanel nd={output} title="After" />
      </div>
    </div>
  );
}
