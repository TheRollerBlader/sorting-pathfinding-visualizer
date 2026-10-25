import { GridNode, PathfindingResult } from '../../types/pathfinding';
import { getNeighbors, reconstructPath } from './helpers';

export function dijkstra(
  grid: GridNode[][],
  startNode: GridNode,
  endNode: GridNode
): PathfindingResult {
  const startTime = performance.now();
  const visitedNodesInOrder: GridNode[] = [];

  startNode.distance = 0;
  const unvisitedNodes: GridNode[] = [];

  for (const row of grid) {
    for (const node of row) {
      unvisitedNodes.push(node);
    }
  }

  while (unvisitedNodes.length > 0) {
    // Sort to extract the lowest distance
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift()!;

    // If wall, ignore
    if (closestNode.isWall) continue;

    // If closest distance is infinity, no path exists
    if (closestNode.distance === Infinity) break;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Target reached
    if (closestNode.row === endNode.row && closestNode.col === endNode.col) {
      const { path, cost } = reconstructPath(closestNode);
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

    const neighbors = getNeighbors(closestNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const altDistance = closestNode.distance + neighbor.weight;
        if (altDistance < neighbor.distance) {
          neighbor.distance = altDistance;
          neighbor.previousNode = closestNode;
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
