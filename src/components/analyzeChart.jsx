import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../styles/analyze.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function buildHistogram(values, binCount = 15) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const binSize = range / binCount;

  const counts = new Array(binCount).fill(0);
  const labels = [];

  for (let i = 0; i < binCount; i++) {
    labels.push((min + i * binSize).toFixed(2));
  }

  values.forEach(v => {
    let idx = Math.floor((v - min) / binSize);
    if (idx >= binCount) idx = binCount - 1;
    counts[idx]++;
  });

  return { labels, counts, min, binSize };
}

function linePlugin(mean, median, min, binSize) {
  return {
    id: 'lines',
    afterDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return;

      const draw = (val, color, label) => {
        const x = scales.x.getPixelForValue(Math.max(0, (val - min) / binSize));
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = '11px sans-serif';
        ctx.fillText(label, x + 5, chartArea.top + 15);
        ctx.restore();
      };

      if (mean != null) draw(mean, '#111', `μ ${mean.toFixed(3)}`);
      if (median != null) draw(median, '#6b7280', `M ${median.toFixed(3)}`);
    }
  };
}

export default function AnalyzeChart({ input, stats }) {
  if (!input) {
    return (
      <div className="chartBox">
        <div className="placeholder">Run a computation in the previous step first.</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="chartBox">
        <div className="placeholder">Analyze data to see the distribution.</div>
      </div>
    );
  }

  const values = Array.isArray(input.value) ? input.value : [input.value];
  const { labels, counts, min, binSize } = buildHistogram(values);
  const { mean, median, variance, stdDev } = stats;

  const chartData = {
    labels,
    datasets: [{
      data: counts,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: '#3b82f6',
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Value distribution', color: '#555' }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 } } },
      y: { beginAtZero: true, ticks: { font: { size: 9 } } }
    }
  };

  return (
    <div className="chartBox col">
      <div className="stats-row">
        <span className="chip">Mean: {mean.toFixed(4)}</span>
        <span className="chip">Median: {median.toFixed(4)}</span>
        <span className="chip">Var: {variance.toFixed(4)}</span>
        <span className="chip">Std: {stdDev.toFixed(4)}</span>
      </div>
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} plugins={[linePlugin(mean, median, min, binSize)]} />
      </div>
    </div>
  );
}
