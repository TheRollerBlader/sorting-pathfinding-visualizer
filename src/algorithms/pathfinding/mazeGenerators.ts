import { GridNode } from '../../types/pathfinding';

export function generateRecursiveDivision(
  grid: GridNode[][],
  startNode: { row: number; col: number },
  endNode: { row: number; col: number }
): { row: number; col: number }[] {
  const walls: { row: number; col: number }[] = [];
  const numRows = grid.length;
  const numCols = grid[0].length;

  // Add perimeter borders first
  for (let r = 0; r < numRows; r++) {
    if ((r !== startNode.row || 0 !== startNode.col) && (r !== endNode.row || 0 !== endNode.col)) {
      walls.push({ row: r, col: 0 });
    }
    if ((r !== startNode.row || numCols - 1 !== startNode.col) && (r !== endNode.row || numCols - 1 !== endNode.col)) {
      walls.push({ row: r, col: numCols - 1 });
    }
  }
  for (let c = 0; c < numCols; c++) {
    if ((0 !== startNode.row || c !== startNode.col) && (0 !== endNode.row || c !== endNode.col)) {
      walls.push({ row: 0, col: c });
    }
    if ((numRows - 1 !== startNode.row || c !== startNode.col) && (numRows - 1 !== endNode.row || c !== endNode.col)) {
      walls.push({ row: numRows - 1, col: c });
    }
  }

  function divide(
    rowStart: number,
    rowEnd: number,
    colStart: number,
    colEnd: number,
    orientation: 'horizontal' | 'vertical'
  ) {
    if (rowEnd < rowStart || colEnd < colStart) return;

    const width = colEnd - colStart;
    const height = rowEnd - rowStart;

    if (width < 2 || height < 2) return;

    if (orientation === 'horizontal') {
      const possibleRows: number[] = [];
      for (let r = rowStart + 1; r < rowEnd; r += 2) possibleRows.push(r);
      const possibleCols: number[] = [];
      for (let c = colStart; c <= colEnd; c += 2) possibleCols.push(c);

      if (possibleRows.length === 0 || possibleCols.length === 0) return;

      const randomRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
      const passageCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

      for (let c = colStart; c <= colEnd; c++) {
        if (c !== passageCol) {
          if (
            !(randomRow === startNode.row && c === startNode.col) &&
            !(randomRow === endNode.row && c === endNode.col)
          ) {
            walls.push({ row: randomRow, col: c });
          }
        }
      }

      const nextOrientation1 = height - 1 > (randomRow - 1 - rowStart) ? 'horizontal' : 'vertical';
      const nextOrientation2 = height - 1 > (rowEnd - (randomRow + 1)) ? 'horizontal' : 'vertical';

      divide(rowStart, randomRow - 1, colStart, colEnd, nextOrientation1);
      divide(randomRow + 1, rowEnd, colStart, colEnd, nextOrientation2);
    } else {
      const possibleCols: number[] = [];
      for (let c = colStart + 1; c < colEnd; c += 2) possibleCols.push(c);
      const possibleRows: number[] = [];
      for (let r = rowStart; r <= rowEnd; r += 2) possibleRows.push(r);

      if (possibleCols.length === 0 || possibleRows.length === 0) return;

      const randomCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
      const passageRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

      for (let r = rowStart; r <= rowEnd; r++) {
        if (r !== passageRow) {
          if (
            !(r === startNode.row && randomCol === startNode.col) &&
            !(r === endNode.row && randomCol === endNode.col)
          ) {
            walls.push({ row: r, col: randomCol });
          }
        }
      }

      const nextOrientation1 = (randomCol - 1 - colStart) > height ? 'vertical' : 'horizontal';
      const nextOrientation2 = (colEnd - (randomCol + 1)) > height ? 'vertical' : 'horizontal';

      divide(rowStart, rowEnd, colStart, randomCol - 1, nextOrientation1);
      divide(rowStart, rowEnd, randomCol + 1, colEnd, nextOrientation2);
    }
  }

  divide(1, numRows - 2, 1, numCols - 2, numCols > numRows ? 'vertical' : 'horizontal');
  return walls;
}

export function generatePrimsMaze(
  grid: GridNode[][],
  startNode: { row: number; col: number },
  endNode: { row: number; col: number }
): { row: number; col: number }[] {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const isWall: boolean[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(true)
  );

  // Leave start and end open
  isWall[startNode.row][startNode.col] = false;
  isWall[endNode.row][endNode.col] = false;

  interface Cell {
    r: number;
    c: number;
    parentR: number;
    parentC: number;
  }

  const frontier: Cell[] = [];

  function addNeighbors(r: number, c: number) {
    const directions = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ];

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr > 0 && nr < numRows - 1 && nc > 0 && nc < numCols - 1) {
        if (isWall[nr][nc]) {
          frontier.push({ r: nr, c: nc, parentR: r, parentC: c });
        }
      }
    }
  }

  // Start carving from startNode (clamped to odd)
  const initialR = startNode.row % 2 === 1 ? startNode.row : Math.max(1, startNode.row - 1);
  const initialC = startNode.col % 2 === 1 ? startNode.col : Math.max(1, startNode.col - 1);
  isWall[initialR][initialC] = false;
  addNeighbors(initialR, initialC);

  while (frontier.length > 0) {
    const randomIndex = Math.floor(Math.random() * frontier.length);
    const { r, c, parentR, parentC } = frontier.splice(randomIndex, 1)[0];

    if (isWall[r][c]) {
      isWall[r][c] = false;
      const betweenR = Math.floor((r + parentR) / 2);
      const betweenC = Math.floor((c + parentC) / 2);
      isWall[betweenR][betweenC] = false;
      addNeighbors(r, c);
    }
  }

  // Open paths leading directly to start and end
  isWall[startNode.row][startNode.col] = false;
  isWall[endNode.row][endNode.col] = false;

  const walls: { row: number; col: number }[] = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (
        isWall[r][c] &&
        !(r === startNode.row && c === startNode.col) &&
        !(r === endNode.row && c === endNode.col)
      ) {
        walls.push({ row: r, col: c });
      }
    }
  }
  return walls;
}

export function generateRandomScatter(
  grid: GridNode[][],
  startNode: { row: number; col: number },
  endNode: { row: number; col: number },
  density: number = 0.28
): { walls: { row: number; col: number }[]; weights: { row: number; col: number }[] } {
  const walls: { row: number; col: number }[] = [];
  const weights: { row: number; col: number }[] = [];
  const numRows = grid.length;
  const numCols = grid[0].length;

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if ((r === startNode.row && c === startNode.col) || (r === endNode.row && c === endNode.col)) {
        continue;
      }
      const rand = Math.random();
      if (rand < density * 0.7) {
        walls.push({ row: r, col: c });
      } else if (rand < density * 1.1) {
        weights.push({ row: r, col: c });
      }
    }
  }
  return { walls, weights };
}
