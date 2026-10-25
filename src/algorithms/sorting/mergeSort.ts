import { SortStep } from '../../types/sorting';

export function* mergeSort(arr: number[]): Generator<SortStep, void, unknown> {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const sortedIndices: number[] = [];

  function* merge(start: number, mid: number, end: number): Generator<SortStep, void, unknown> {
    const left = a.slice(start, mid + 1);
    const right = a.slice(mid + 1, end + 1);
    accesses += (mid - start + 1) + (end - mid);

    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      comparisons++;
      accesses += 2;
      yield {
        array: [...a],
        comparingIndices: [start + i, mid + 1 + j],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Merging: Comparing ${left[i]} (left) with ${right[j]} (right)`,
      };

      if (left[i] <= right[j]) {
        a[k] = left[i];
        accesses++;
        swaps++;
        yield {
          array: [...a],
          comparingIndices: [],
          swappingIndices: [k],
          sortedIndices: [...sortedIndices],
          comparisons,
          swaps,
          accesses,
          description: `Placed ${left[i]} from left partition into index ${k}`,
        };
        i++;
      } else {
        a[k] = right[j];
        accesses++;
        swaps++;
        yield {
          array: [...a],
          comparingIndices: [],
          swappingIndices: [k],
          sortedIndices: [...sortedIndices],
          comparisons,
          swaps,
          accesses,
          description: `Placed ${right[j]} from right partition into index ${k}`,
        };
        j++;
      }
      k++;
    }

    while (i < left.length) {
      a[k] = left[i];
      accesses += 2;
      swaps++;
      yield {
        array: [...a],
        comparingIndices: [],
        swappingIndices: [k],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Copying remaining left element ${left[i]} into index ${k}`,
      };
      i++;
      k++;
    }

    while (j < right.length) {
      a[k] = right[j];
      accesses += 2;
      swaps++;
      yield {
        array: [...a],
        comparingIndices: [],
        swappingIndices: [k],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Copying remaining right element ${right[j]} into index ${k}`,
      };
      j++;
      k++;
    }

    if (start === 0 && end === n - 1) {
      for (let idx = 0; idx < n; idx++) {
        if (!sortedIndices.includes(idx)) sortedIndices.push(idx);
      }
    }
  }

  function* mergeSortHelper(start: number, end: number): Generator<SortStep, void, unknown> {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      yield* mergeSortHelper(start, mid);
      yield* mergeSortHelper(mid + 1, end);
      yield* merge(start, mid, end);
    }
  }

  yield* mergeSortHelper(0, n - 1);

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
