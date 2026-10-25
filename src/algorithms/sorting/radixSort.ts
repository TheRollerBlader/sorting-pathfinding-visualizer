import { SortStep } from '../../types/sorting';

export function* radixSort(arr: number[]): Generator<SortStep, void, unknown> {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  if (n <= 1) return;

  const maxVal = Math.max(...a);
  accesses += n;

  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    // Count frequencies of current digit
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(a[i] / exp) % 10;
      count[digit]++;
      accesses += 2;

      yield {
        array: [...a],
        comparingIndices: [i],
        swappingIndices: [],
        pivotIndex: i,
        sortedIndices: [],
        comparisons,
        swaps,
        accesses,
        description: `Pass exp=${exp}: Counting digit ${(Math.floor(a[i] / exp) % 10)} for value ${a[i]}`,
      };
    }

    // Accumulate count
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build the output array (stable backwards loop)
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10;
      const targetIdx = count[digit] - 1;
      output[targetIdx] = a[i];
      count[digit]--;
      accesses += 3;
      swaps++;
    }

    // Copy output array back into a with visual updates
    for (let i = 0; i < n; i++) {
      a[i] = output[i];
      accesses++;
      swaps++;

      yield {
        array: [...a],
        comparingIndices: [],
        swappingIndices: [i],
        pivotIndex: i,
        sortedIndices: exp * 10 > maxVal ? Array.from({ length: i + 1 }, (_, k) => k) : [],
        comparisons,
        swaps,
        accesses,
        description: `Pass exp=${exp}: Placed ${output[i]} into position ${i}`,
      };
    }
  }

  yield {
    array: [...a],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    comparisons,
    swaps,
    accesses,
    description: 'Radix sort complete! Array is sorted.',
  };
}
