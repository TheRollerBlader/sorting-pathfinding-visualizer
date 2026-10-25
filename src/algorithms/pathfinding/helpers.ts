import { GridNode } from '../../types/pathfinding';

export function getNeighbors(node: GridNode, grid: GridNode[][]): GridNode[] {
  const neighbors: GridNode[] = [];
  const { row, col } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;

  // 4 directions: Up, Right, Down, Left
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col < numCols - 1) neighbors.push(grid[row][col + 1]);
  if (row < numRows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);

  return neighbors;
}

export function reconstructPath(endNode: GridNode): { path: GridNode[]; cost: number } {
  const path: GridNode[] = [];
  let curr: GridNode | null = endNode;
  let cost = 0;

  while (curr !== null) {
    path.unshift(curr);
    cost += curr.weight;
    curr = curr.previousNode;
  }

  // Deduct start node weight if desired, or keep as standard
  return { path, cost };
}

export function manhattanDistance(nodeA: GridNode, nodeB: GridNode): number {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

export function cloneGrid(grid: GridNode[][]): GridNode[][] {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      distance: Infinity,
      heuristic: 0,
      totalCost: Infinity,
      isVisited: false,
      isPath: false,
      previousNode: null,
    }))
  );
}
