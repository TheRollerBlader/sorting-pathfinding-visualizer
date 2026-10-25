import { GridNode, PathfindingResult } from '../../types/pathfinding';
import { getNeighbors, reconstructPath } from './helpers';

export function dfs(
  grid: GridNode[][],
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const startTime = performance.now();
  const visitedNodesInOrder: GridNode[] = [];
  const stack: GridNode[] = [startNode];

  startNode.distance = 0;

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (current.isVisited) continue;
    current.isVisited = true;
    visitedNodesInOrder.push(current);

    if (current.row === endNode.row && current.col === endNode.col) {
      const { path, cost } = reconstructPath(current);
      const timeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        visitedNodesInOrder,
        nodesInShortestPathOrder: path,
        totalCost: cost,
        pathLength: path.length,
        nodesVisitedCount: visitedNodesInOrder.length,
        timeMs,
        found: true,
      };
    }

    const neighbors = getNeighbors(current, grid);
    // Reverse to explore intuitively
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = current;
        neighbor.distance = current.distance + 1;
        stack.push(neighbor);
      }
    }
  }

  const timeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    visitedNodesInOrder,
    nodesInShortestPathOrder: [],
    totalCost: 0,
    pathLength: 0,
    nodesVisitedCount: visitedNodesInOrder.length,
    timeMs,
    found: false,
  };
}
