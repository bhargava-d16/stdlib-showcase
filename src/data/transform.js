import expandDimensions from '@stdlib/ndarray-base-expand-dimensions';
import removeSingletonDimensions from '@stdlib/ndarray-base-remove-singleton-dimensions';
import broadcastArray from '@stdlib/ndarray-broadcast-array';
import sliceDimension from '@stdlib/ndarray-slice-dimension';
import ndarray from '@stdlib/ndarray-ctor';

function extractValues(nd) {
  const total = nd.length;
  const values = [];
  if (nd.ndims === 1) {
    for (let i = 0; i < total; i++) values.push(nd.get(i));
  } else if (nd.ndims === 2) {
    for (let r = 0; r < nd.shape[0]; r++) {
      for (let c = 0; c < nd.shape[1]; c++) values.push(nd.get(r, c));
    }
  } else {
    for (let i = 0; i < total; i++) values.push(nd.data[nd.offset + i]);
  }
  return values;
}

function buildStrides(shape) {
  const strides = new Array(shape.length);
  let s = 1;
  for (let i = shape.length - 1; i >= 0; i--) {
    strides[i] = s;
    s *= shape[i];
  }
  return strides;
}

export function expandDims(nd, axis) {
  return expandDimensions(nd, axis);
}

export function squeezeNdArray(nd) {
  return removeSingletonDimensions(nd);
}

export function concatNdArray(nd) {
  const shape = Array.from(nd.shape);
  const values = extractValues(nd);
  const doubled = [...values, ...values];
  const newShape = shape.slice();
  newShape[0] = shape[0] * 2;
  const strides = buildStrides(newShape);
  return ndarray('generic', doubled, newShape, strides, 0, 'row-major');
}

export function broadcastNdArray(nd, shape) {
  return broadcastArray(nd, shape);
}

export function sliceDim(nd, dimension, index) {
  return sliceDimension(nd, dimension, index);
}
