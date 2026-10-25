import { GridNode, PathfindingResult } from '../../types/pathfinding';
import { getNeighbors, manhattanDistance, reconstructPath } from './helpers';

export function greedyBfs(
  grid: GridNode[][],
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const startTime = performance.now();
  const visitedNodesInOrder: GridNode[] = [];

  startNode.heuristic = manhattanDistance(startNode, endNode);
  const openSet: GridNode[] = [startNode];
  const openSetLookup = new Set<string>([`${startNode.row},${startNode.col}`]);

  while (openSet.length > 0) {
    // Sort strictly by heuristic h(n)
    openSet.sort((a, b) => a.heuristic - b.heuristic);
    const current = openSet.shift()!;
    openSetLookup.delete(`${current.row},${current.col}`);

    if (current.isWall) continue;

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
    for (const neighbor of neighbors) {
      if (neighbor.isVisited || neighbor.isWall) continue;

      const key = `${neighbor.row},${neighbor.col}`;
      if (!openSetLookup.has(key)) {
        neighbor.previousNode = current;
        neighbor.heuristic = manhattanDistance(neighbor, endNode);
        openSet.push(neighbor);
        openSetLookup.add(key);
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
