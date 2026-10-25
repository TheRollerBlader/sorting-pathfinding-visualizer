import { SortStep } from '../../types/sorting';

export function* heapSort(arr: number[]): Generator<SortStep, void, unknown> {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const sortedIndices: number[] = [];

  function* heapify(size: number, rootIdx: number): Generator<SortStep, void, unknown> {
    let largest = rootIdx;
    const left = 2 * rootIdx + 1;
    const right = 2 * rootIdx + 2;

    if (left < size) {
      comparisons++;
      accesses += 2;
      yield {
        array: [...a],
        comparingIndices: [left, largest],
        swappingIndices: [],
        pivotIndex: rootIdx,
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Heapifying: Comparing left child ${a[left]} with root ${a[largest]}`,
      };
      if (a[left] > a[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      comparisons++;
      accesses += 2;
      yield {
        array: [...a],
        comparingIndices: [right, largest],
        swappingIndices: [],
        pivotIndex: rootIdx,
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Heapifying: Comparing right child ${a[right]} with largest ${a[largest]}`,
      };
      if (a[right] > a[largest]) {
        largest = right;
      }
    }

    if (largest !== rootIdx) {
      swaps++;
      accesses += 4;
      const temp = a[rootIdx];
      a[rootIdx] = a[largest];
      a[largest] = temp;

      yield {
        array: [...a],
        comparingIndices: [],
        swappingIndices: [rootIdx, largest],
        pivotIndex: largest,
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Swapped root ${temp} with larger child ${a[rootIdx]}`,
      };

      yield* heapify(size, largest);
    }
  }

  // 1. Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  // 2. Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    accesses += 4;
    const temp = a[0];
    a[0] = a[i];
    a[i] = temp;

    sortedIndices.push(i);

    yield {
      array: [...a],
      comparingIndices: [],
      swappingIndices: [0, i],
      pivotIndex: i,
      sortedIndices: [...sortedIndices],
      comparisons,
      swaps,
      accesses,
      description: `Moved maximum element ${temp} to sorted position ${i}`,
    };

    yield* heapify(i, 0);
  }

  sortedIndices.push(0);

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    comparisons,
    swaps,
    accesses,
    description: 'Array is completely sorted!',
  };
}
