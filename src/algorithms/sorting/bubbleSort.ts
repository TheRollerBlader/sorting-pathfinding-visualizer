import { SortStep } from '../../types/sorting';

export function* bubbleSort(arr: number[]): Generator<SortStep, void, unknown> {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      accesses += 2;
      yield {
        array: [...a],
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Comparing elements at index ${j} (${a[j]}) and ${j + 1} (${a[j + 1]})`,
      };

      if (a[j] > a[j + 1]) {
        swaps++;
        accesses += 4;
        const temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        swapped = true;

        yield {
          array: [...a],
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          comparisons,
          swaps,
          accesses,
          description: `Swapped ${a[j]} and ${a[j + 1]}`,
        };
      }
    }
    sortedIndices.push(n - i - 1);
    if (!swapped) {
      // Early exit if already sorted
      for (let k = 0; k < n - i - 1; k++) {
        if (!sortedIndices.includes(k)) sortedIndices.push(k);
      }
      break;
    }
  }

  // Final sorted step
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
