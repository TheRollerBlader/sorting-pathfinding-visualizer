import { SortStep } from '../../types/sorting';

export function* insertionSort(arr: number[]): Generator<SortStep, void, unknown> {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;
  const sortedIndices: number[] = [0];

  for (let i = 1; i < n; i++) {
    const key = a[i];
    accesses++;
    let j = i - 1;

    yield {
      array: [...a],
      comparingIndices: [i],
      swappingIndices: [],
      pivotIndex: i,
      sortedIndices: [...sortedIndices],
      comparisons,
      swaps,
      accesses,
      description: `Selected key element ${key} at index ${i}`,
    };

    while (j >= 0) {
      comparisons++;
      accesses++;
      yield {
        array: [...a],
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        pivotIndex: i,
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        accesses,
        description: `Comparing key ${key} with ${a[j]}`,
      };

      if (a[j] > key) {
        swaps++;
        accesses += 2;
        a[j + 1] = a[j];
        yield {
          array: [...a],
          comparingIndices: [],
          swappingIndices: [j + 1],
          pivotIndex: i,
          sortedIndices: [...sortedIndices],
          comparisons,
          swaps,
          accesses,
          description: `Shifted element ${a[j]} right to index ${j + 1}`,
        };
        j--;
      } else {
        break;
      }
    }

    a[j + 1] = key;
    accesses++;
    sortedIndices.push(i);

    yield {
      array: [...a],
      comparingIndices: [],
      swappingIndices: [j + 1],
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
      comparisons,
      swaps,
      accesses,
      description: `Inserted key ${key} at index ${j + 1}`,
    };
  }

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
