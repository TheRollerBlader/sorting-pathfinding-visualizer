import { SortStep } from '../../types/sorting';

export function* selectionSort(arr: number[]): Generator<SortStep, void, unknown> {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    yield {
      array: [...a],
      comparingIndices: [i],
      swappingIndices: [],
      pivotIndex: minIdx,
      sortedIndices: [...sortedIndices],
      comparisons,
      swaps,
      accesses,
      description: `Searching for minimum element starting at index ${i}`,
    };

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      accesses += 2;
      yield {
        array: [...a],
        comparingIndices: [j, minIdx],
        swappingIndices: [],
        pivotIndex: minIdx,
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Comparing candidate ${a[j]} with current minimum ${a[minIdx]}`,
      };

      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield {
          array: [...a],
          comparingIndices: [j],
          swappingIndices: [],
          pivotIndex: minIdx,
          sortedIndices: [...sortedIndices],
          comparisons,
          swaps,
          accesses,
          description: `Found new minimum ${a[minIdx]} at index ${minIdx}`,
        };
      }
    }

    if (minIdx !== i) {
      swaps++;
      accesses += 4;
      const temp = a[i];
      a[i] = a[minIdx];
      a[minIdx] = temp;

      yield {
        array: [...a],
        comparingIndices: [],
        swappingIndices: [i, minIdx],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Swapped minimum ${a[i]} into position ${i}`,
      };
    }

    sortedIndices.push(i);
  }

  sortedIndices.push(n - 1);

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
