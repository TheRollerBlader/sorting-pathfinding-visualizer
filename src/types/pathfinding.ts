export type PathfindingAlgorithmType =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'astar'
  | 'greedy';

export type ToolMode = 'wall' | 'weight' | 'eraser';

export type MazeType = 'recursive-division' | 'prims' | 'random-scatter';

export interface GridNode {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  weight: number; // 1 for normal, 5 for mud/forest terrain
  distance: number;
  heuristic: number;
  totalCost: number;
  isVisited: boolean;
  isPath: boolean;
  previousNode: GridNode | null;
}

export interface PathfindingResult {
  visitedNodesInOrder: GridNode[];
  nodesInShortestPathOrder: GridNode[];
  totalCost: number;
  pathLength: number;
  nodesVisitedCount: number;
  timeMs: number;
  found: boolean;
}

export interface PathfindingTelemetry {
  nodesVisited: number;
  pathLength: number;
  totalCost: number;
  timeMs: number;
  isComplete: boolean;
}

export interface PathfindingAlgorithmMetadata {
  id: PathfindingAlgorithmType;
  name: string;
  weighted: boolean;
  guaranteesShortestPath: boolean;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}
