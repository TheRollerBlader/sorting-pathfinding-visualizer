import { AlgorithmMetadata, SortingAlgorithmType } from '../types/sorting';
import { PathfindingAlgorithmMetadata, PathfindingAlgorithmType } from '../types/pathfinding';

export const SORTING_METADATA: Record<SortingAlgorithmType, AlgorithmMetadata> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    category: 'comparison',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    description:
      'Iteratively steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. With an early termination flag, runs in linear time if the list is already sorted.',
    codeSnippet: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    category: 'comparison',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    description:
      'Builds the final sorted array one item at a time. Extremely efficient on small arrays and datasets that are already substantially sorted (online algorithm).',
    codeSnippet: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i], j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    category: 'comparison',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    description:
      'Divides the input into a sorted and unsorted region. Repeatedly finds the minimal element from the unsorted region and appends it to the sorted region. Makes at most O(n) swaps.',
    codeSnippet: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
}`,
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    category: 'comparison',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false,
    description:
      'A divide-and-conquer algorithm that recursively splits the array into two halves, sorts them, and merges the sorted sublists. Predictable guaranteed O(n log n) performance.',
    codeSnippet: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    category: 'comparison',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    inPlace: true,
    description:
      'Selects a pivot element and partitions the array into values smaller and greater than the pivot, then recurses. Cache-friendly and generally faster in practice than Merge or Heap sort.',
    codeSnippet: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}`,
  },
  heap: {
    id: 'heap',
    name: 'Heap Sort',
    category: 'comparison',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    description:
      'Transforms the array into a binary max-heap. Iteratively extracts the maximum root element and swaps it to the end, then re-heapifies the remaining elements.',
    codeSnippet: `function heapSort(arr) {
  buildMaxHeap(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}`,
  },
  radix: {
    id: 'radix',
    name: 'Radix Sort (LSD)',
    category: 'non-comparison',
    timeComplexity: {
      best: 'O(n · k)',
      average: 'O(n · k)',
      worst: 'O(n · k)',
    },
    spaceComplexity: 'O(n + k)',
    stable: true,
    inPlace: false,
    description:
      'Non-comparative integer sorting algorithm that avoids comparisons by grouping keys by individual digits sharing the same significant position and value.',
    codeSnippet: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
}`,
  },
};

export const PATHFINDING_METADATA: Record<PathfindingAlgorithmType, PathfindingAlgorithmMetadata> = {
  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    weighted: false,
    guaranteesShortestPath: true,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description:
      'Explores the neighbor nodes first before moving to the next level neighbors. Guarantees the shortest path on unweighted graphs using a FIFO queue.',
  },
  dfs: {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    weighted: false,
    guaranteesShortestPath: false,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description:
      'Explores as far as possible along each branch before backtracking using a LIFO stack. Does not guarantee the shortest path, but useful for topological traversal and maze generation.',
  },
  dijkstra: {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    weighted: true,
    guaranteesShortestPath: true,
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description:
      "Finds the shortest paths between nodes in a graph with non-negative edge weights. The father of pathfinding, guarantees optimal shortest paths across terrain costs.",
  },
  astar: {
    id: 'astar',
    name: 'A* Search',
    weighted: true,
    guaranteesShortestPath: true,
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(V)',
    description:
      'Combines Dijkstra with a heuristic function f(n) = g(n) + h(n) (Manhattan distance) to guide the search towards the destination. Optimal and faster than Dijkstra.',
  },
  greedy: {
    id: 'greedy',
    name: 'Greedy Best-First Search',
    weighted: false,
    guaranteesShortestPath: false,
    timeComplexity: 'O(V log V)',
    spaceComplexity: 'O(V)',
    description:
      'Selects the path that appears closest to the goal according to the heuristic h(n). Fast and direct, but prone to getting stuck in local minima or taking sub-optimal detours.',
  },
};
