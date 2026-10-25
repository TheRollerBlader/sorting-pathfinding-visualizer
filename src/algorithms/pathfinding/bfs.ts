import { GridNode, PathfindingResult } from '../../types/pathfinding';
import { getNeighbors, reconstructPath } from './helpers';

export function bfs(
  grid: GridNode[][],
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const startTime = performance.now();
  const visitedNodesInOrder: GridNode[] = [];
  const queue: GridNode[] = [startNode];

  startNode.distance = 0;
  startNode.isVisited = true;

  while (queue.length > 0) {
    const current = queue.shift()!;
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
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.distance = current.distance + 1;
        neighbor.previousNode = current;
        queue.push(neighbor);
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
