import { useState, useEffect } from 'react';
import Pipeline from './components/pipeline';
import GenerateBox from './components/generateBox';
import ChartView from './components/chartView';
import DataInfo from './components/dataInfo';
import TransformBox from './components/transformBox';
import TransformChart from './components/transformChart';
import ComputeBox from './components/computeBox';
import ComputeChart from './components/computeChart';
import AnalyzeBox from './components/analyzeBox';
import AnalyzeChart from './components/analyzeChart';
import { generateData } from './data/generate';

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState([]);
  const [array, setArray] = useState(null);
  const [transformed, setTransformed] = useState(null);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setData(generateData(10));
  }, []);

  const reset = (size) => {
    setData(generateData(size));
    setArray(null);
    setTransformed(null);
    setResult(null);
    setStats(null);
  };

  const setRaw = (newData) => {
    setData(newData);
    setArray(null);
    setTransformed(null);
    setResult(null);
    setStats(null);
  };

  const renderContent = () => {
    if (activeStep === 2) {
      return (
        <div className="main-content">
          <div className="left-column">
            <TransformBox
              data={array}
              setTransformed={setTransformed}
            />
          </div>
          <div className="right-column">
            <TransformChart
              input={array}
              output={transformed}
            />
          </div>
        </div>
      );
    }

    if (activeStep === 3) {
      return (
        <div className="main-content">
          <div className="left-column">
            <ComputeBox
              transformed={transformed}
              setResult={setResult}
            />
          </div>
          <div className="right-column">
            <ComputeChart
              input={transformed}
              result={result}
            />
          </div>
        </div>
      );
    }

    if (activeStep === 4) {
      return (
        <div className="main-content">
          <div className="left-column">
            <AnalyzeBox
              result={result}
              setStats={setStats}
            />
          </div>
          <div className="right-column">
            <AnalyzeChart
              input={result}
              stats={stats}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="main-content">
        <div className="left-column">
          <GenerateBox
            stepIndex={activeStep}
            data={data}
            reset={reset}
            setRaw={setRaw}
            setArray={setArray}
          />
          <DataInfo array={array} />
        </div>
        <div className="right-column">
          <ChartView stepIndex={activeStep} data={data} array={array} />
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Data pipeline explorer</h1>
        <p className="app-instruction">
          Start by generating raw data, then click through each step — your data will move forward automatically, ending in a simple analysis of the results.
        </p>
      </header>

      <Pipeline activeStep={activeStep} onStepChange={setActiveStep} />

      {renderContent()}

      <footer className="app-footer">
        <p className="app-attribution">
          Built with <a href="https://stdlib.io/" target="_blank" rel="noopener noreferrer">stdlib</a>
        </p>
      </footer>
    </div>
  );
}