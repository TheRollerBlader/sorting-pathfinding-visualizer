import { SortStep } from '../../types/sorting';

export function* quickSort(arr: number[]): Generator<SortStep, void, unknown> {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const sortedIndices: number[] = [];

  function* partition(low: number, high: number): Generator<SortStep, number, unknown> {
    const pivot = a[high];
    accesses++;
    let i = low - 1;

    yield {
      array: [...a],
      comparingIndices: [],
      swappingIndices: [],
      pivotIndex: high,
      sortedIndices: [...sortedIndices],
      comparisons,
      swaps,
      accesses,
      description: `Pivot chosen: ${pivot} at index ${high}`,
    };

    for (let j = low; j < high; j++) {
      comparisons++;
      accesses += 2;
      yield {
        array: [...a],
        comparingIndices: [j, high],
        swappingIndices: [],
        pivotIndex: high,
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Comparing ${a[j]} against pivot ${pivot}`,
      };

      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          swaps++;
          accesses += 4;
          const temp = a[i];
          a[i] = a[j];
          a[j] = temp;

          yield {
            array: [...a],
            comparingIndices: [],
            swappingIndices: [i, j],
            pivotIndex: high,
            sortedIndices: [...sortedIndices],
            comparisons,
            swaps,
            accesses,
            description: `Swapped ${a[i]} (<= pivot) and ${a[j]}`,
          };
        }
      }
    }

    // Place pivot in correct position
    swaps++;
    accesses += 4;
    const temp = a[i + 1];
    a[i + 1] = a[high];
    a[high] = temp;

    if (!sortedIndices.includes(i + 1)) {
      sortedIndices.push(i + 1);
    }

    yield {
      array: [...a],
      comparingIndices: [],
      swappingIndices: [i + 1, high],
      pivotIndex: i + 1,
      sortedIndices: [...sortedIndices],
      comparisons,
      swaps,
      accesses,
      description: `Pivot ${pivot} placed at final sorted position ${i + 1}`,
    };

    return i + 1;
  }

  function* quickSortHelper(low: number, high: number): Generator<SortStep, void, unknown> {
    if (low < high) {
      const pi: number = yield* partition(low, high);
      yield* quickSortHelper(low, pi - 1);
      yield* quickSortHelper(pi + 1, high);
    } else if (low === high) {
      if (!sortedIndices.includes(low)) sortedIndices.push(low);
    }
  }

  yield* quickSortHelper(0, n - 1);

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
