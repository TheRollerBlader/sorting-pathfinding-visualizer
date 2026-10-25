import { GridNode, PathfindingAlgorithmType, PathfindingResult } from '../../types/pathfinding';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';
import { astar } from './astar';
import { greedyBfs } from './greedyBfs';
import { cloneGrid } from './helpers';

export { bfs, dfs, dijkstra, astar, greedyBfs };

export function runPathfindingAlgorithm(
  type: PathfindingAlgorithmType,
  grid: GridNode[][],
  startCoords: { row: number; col: number },
  endCoords: { row: number; col: number }
): PathfindingResult {
  const workingGrid = cloneGrid(grid);
  const startNode = workingGrid[startCoords.row][startCoords.col];
  const endNode = workingGrid[endCoords.row][endCoords.col];

  switch (type) {
    case 'bfs':
      return bfs(workingGrid, startNode, endNode);
    case 'dfs':
      return dfs(workingGrid, startNode, endNode);
    case 'dijkstra':
      return dijkstra(workingGrid, startNode, endNode);
    case 'astar':
      return astar(workingGrid, startNode, endNode);
    case 'greedy':
      return greedyBfs(workingGrid, startNode, endNode);
    default:
      return bfs(workingGrid, startNode, endNode);
  }
}
