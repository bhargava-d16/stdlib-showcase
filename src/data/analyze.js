import mean from '@stdlib/stats-base-mean';
import variance from '@stdlib/stats-base-variance';
import stdev from '@stdlib/stats-base-stdev';

function toFlatArray(computedResult) {
  if (Array.isArray(computedResult.value)) {
    return computedResult.value.slice();
  }
  return [computedResult.value];
}

export function computeMean(computedResult) {
  const data = toFlatArray(computedResult);
  return mean(data.length, data, 1);
}

export function computeMedian(computedResult) {
  const sortedData = toFlatArray(computedResult).sort((a, b) => a - b);
  const mid = Math.floor(sortedData.length / 2);
  if (sortedData.length % 2 === 0) {
    return (sortedData[mid - 1] + sortedData[mid]) / 2;
  }
  return sortedData[mid];
}

export function computeVariance(computedResult) {
  const data = toFlatArray(computedResult);
  return variance(data.length, 1, data, 1);
}

export function computeStdDev(computedResult) {
  const data = toFlatArray(computedResult);
  return stdev(data.length, 1, data, 1);
}

export function runAnalysis(computedResult) {
  return {
    mean: computeMean(computedResult),
    median: computeMedian(computedResult),
    variance: computeVariance(computedResult),
    stdDev: computeStdDev(computedResult),
  };
}
