import { GridNode, PathfindingResult } from '../../types/pathfinding';
import { getNeighbors, manhattanDistance, reconstructPath } from './helpers';

export function astar(
  grid: GridNode[][],
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const startTime = performance.now();
  const visitedNodesInOrder: GridNode[] = [];

  startNode.distance = 0;
  startNode.heuristic = manhattanDistance(startNode, endNode);
  startNode.totalCost = startNode.distance + startNode.heuristic;

  const openSet: GridNode[] = [startNode];
  const openSetLookup = new Set<string>([`${startNode.row},${startNode.col}`]);

  while (openSet.length > 0) {
    // Pick node with lowest totalCost (f = g + h)
    openSet.sort((a, b) => {
      if (a.totalCost === b.totalCost) {
        return a.heuristic - b.heuristic;
      }
      return a.totalCost - b.totalCost;
    });

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

      const tentativeDistance = current.distance + neighbor.weight;

      if (tentativeDistance < neighbor.distance) {
        neighbor.previousNode = current;
        neighbor.distance = tentativeDistance;
        neighbor.heuristic = manhattanDistance(neighbor, endNode);
        neighbor.totalCost = neighbor.distance + neighbor.heuristic;

        const key = `${neighbor.row},${neighbor.col}`;
        if (!openSetLookup.has(key)) {
          openSet.push(neighbor);
          openSetLookup.add(key);
        }
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
