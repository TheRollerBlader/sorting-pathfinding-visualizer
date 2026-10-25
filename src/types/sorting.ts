export type SortingAlgorithmType =
  | 'bubble'
  | 'insertion'
  | 'selection'
  | 'merge'
  | 'quick'
  | 'heap'
  | 'radix';

export type BarState = 'default' | 'comparing' | 'swapping' | 'pivot' | 'sorted';

export interface SortStep {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  pivotIndex?: number;
  sortedIndices: number[];
  comparisons: number;
  swaps: number;
  accesses: number;
  description?: string;
}

export interface SortingTelemetry {
  comparisons: number;
  swaps: number;
  accesses: number;
  timeMs: number;
  isComplete: boolean;
}

export interface AlgorithmMetadata {
  id: SortingAlgorithmType;
  name: string;
  category: 'comparison' | 'non-comparison';
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
  description: string;
  codeSnippet: string;
}
