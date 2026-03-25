import ndarray from '@stdlib/ndarray-ctor';

export function convertToNdArray(data, shape) {
  const size = shape.reduce((a, b) => a * b, 1);
  if (size !== data.length) {
    throw new Error(`Shape [${shape}] needs ${size} elements, got ${data.length}`);
  }

  const strides = new Array(shape.length);
  let s = 1;
  for (let i = shape.length - 1; i >= 0; i--) {
    strides[i] = s;
    s *= shape[i];
  }

  return ndarray('generic', data, shape, strides, 0, 'row-major');
}

export function getNdArrayMeta(nd) {
  return {
    shape: Array.from(nd.shape),
    strides: Array.from(nd.strides),
    offset: nd.offset,
    size: nd.length,
    dtype: nd.dtype,
    order: nd.order,
    ndims: nd.ndims,
  };
}

export function gridFromNdArray(nd) {
  if (nd.ndims === 1) {
    const row = [];
    for (let i = 0; i < nd.shape[0]; i++) row.push(nd.get(i));
    return [row];
  }
  if (nd.ndims === 2) {
    const grid = [];
    for (let r = 0; r < nd.shape[0]; r++) {
      const row = [];
      for (let c = 0; c < nd.shape[1]; c++) row.push(nd.get(r, c));
      grid.push(row);
    }
    return grid;
  }
  return null;
}