import cumax from '@stdlib/stats-base-cumax';
import minabs from '@stdlib/stats-base-minabs';
import range from '@stdlib/stats-base-range';
import cumin from '@stdlib/stats-base-cumin';

function flattenNdArray(nd) {
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

export function computeCumax(nd) {
  const x = flattenNdArray(nd);
  const N = x.length;
  const y = new Array(N).fill(0);
  cumax(N, x, 1, y, 1);
  return y;
}

export function computeMin(nd) {
  const x = flattenNdArray(nd);
  const N = x.length;
  return minabs(N, x, 1);
}

export function computeRange(nd) {
  const x = flattenNdArray(nd);
  const N = x.length;
  return range(N, x, 1);
}

export function computeCumin(nd) {
  const x = flattenNdArray(nd);
  const N = x.length;
  const y = new Array(N).fill(0);
  cumin(N, x, 1, y, 1);
  return y;
}
