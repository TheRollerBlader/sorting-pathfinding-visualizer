import { SortingAlgorithmType, SortStep } from '../../types/sorting';
import { bubbleSort } from './bubbleSort';
import { insertionSort } from './insertionSort';
import { selectionSort } from './selectionSort';
import { mergeSort } from './mergeSort';
import { quickSort } from './quickSort';
import { heapSort } from './heapSort';
import { radixSort } from './radixSort';

export {
  bubbleSort,
  insertionSort,
  selectionSort,
  mergeSort,
  quickSort,
  heapSort,
  radixSort,
};

export function getSortingGenerator(type: SortingAlgorithmType, array: number[]): Generator<SortStep, void, unknown> {
  switch (type) {
    case 'bubble':
      return bubbleSort(array);
    case 'insertion':
      return insertionSort(array);
    case 'selection':
      return selectionSort(array);
    case 'merge':
      return mergeSort(array);
    case 'quick':
      return quickSort(array);
    case 'heap':
      return heapSort(array);
    case 'radix':
      return radixSort(array);
    default:
      return bubbleSort(array);
  }
}
