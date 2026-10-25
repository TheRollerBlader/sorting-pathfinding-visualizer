import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  GridNode,
  PathfindingAlgorithmType,
  ToolMode,
  MazeType,
  PathfindingTelemetry,
} from '../../types/pathfinding';
import { runPathfindingAlgorithm } from '../../algorithms/pathfinding';
import {
  generateRecursiveDivision,
  generatePrimsMaze,
  generateRandomScatter,
} from '../../algorithms/pathfinding/mazeGenerators';
import { PathfindingGrid } from './PathfindingGrid';
import { PathfindingControls } from './PathfindingControls';
import { ComplexityCard } from '../ComplexityCard';
import { soundEngine } from '../../audio/soundEngine';
import { Compass, Footprints, Coins, Clock, Flag, AlertCircle } from 'lucide-react';

const NUM_ROWS = 19;
const NUM_COLS = 37;

export const PathfindingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<PathfindingAlgorithmType>('astar');
  const [toolMode, setToolMode] = useState<ToolMode>('wall');
  const [speed, setSpeed] = useState<number>(15);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Draw walls or drag start (green) and target (red) nodes. Choose an algorithm and find path!'
  );

  const [startCoords, setStartCoords] = useState<{ row: number; col: number }>({
    row: 9,
    col: 5,
  });
  const [endCoords, setEndCoords] = useState<{ row: number; col: number }>({
    row: 9,
    col: 31,
  });

  const [grid, setGrid] = useState<GridNode[][]>([]);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [isDraggingStart, setIsDraggingStart] = useState<boolean>(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState<boolean>(false);

  const [telemetry, setTelemetry] = useState<PathfindingTelemetry>({
    nodesVisited: 0,
    pathLength: 0,
    totalCost: 0,
    timeMs: 0,
    isComplete: false,
  });

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Create initial blank grid
  const createInitialGrid = useCallback(() => {
    const initialGrid: GridNode[][] = [];
    for (let r = 0; r < NUM_ROWS; r++) {
      const currentRow: GridNode[] = [];
      for (let c = 0; c < NUM_COLS; c++) {
        currentRow.push({
          row: r,
          col: c,
          isStart: r === startCoords.row && c === startCoords.col,
          isEnd: r === endCoords.row && c === endCoords.col,
          isWall: false,
          weight: 1,
          distance: Infinity,
          heuristic: 0,
          totalCost: Infinity,
          isVisited: false,
          isPath: false,
          previousNode: null,
        });
      }
      initialGrid.push(currentRow);
    }
    return initialGrid;
  }, [startCoords.row, startCoords.col, endCoords.row, endCoords.col]);

  useEffect(() => {
    setGrid(createInitialGrid());
  }, [createInitialGrid]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const handleClearPath = () => {
    clearTimeouts();
    setIsVisualizing(false);
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((node) => ({
          ...node,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          totalCost: Infinity,
          previousNode: null,
        }))
      )
    );
    setTelemetry({
      nodesVisited: 0,
      pathLength: 0,
      totalCost: 0,
      timeMs: 0,
      isComplete: false,
    });
    setStatusMessage('Path cleared. Walls and terrain retained.');
  };

  const handleClearBoard = () => {
    clearTimeouts();
    setIsVisualizing(false);
    setGrid(createInitialGrid());
    setTelemetry({
      nodesVisited: 0,
      pathLength: 0,
      totalCost: 0,
      timeMs: 0,
      isComplete: false,
    });
    setStatusMessage('Board reset. Ready to draw or generate mazes.');
  };

  // Node editing logic
  const modifyNodeAt = (r: number, c: number) => {
    if ((r === startCoords.row && c === startCoords.col) || (r === endCoords.row && c === endCoords.col)) {
      return;
    }

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      const target = { ...newGrid[r][c] };

      if (toolMode === 'wall') {
        target.isWall = !target.isWall;
        target.weight = 1;
      } else if (toolMode === 'weight') {
        target.weight = target.weight === 5 ? 1 : 5;
        target.isWall = false;
      } else if (toolMode === 'eraser') {
        target.isWall = false;
        target.weight = 1;
      }

      newGrid[r][c] = target;
      return newGrid;
    });
  };

  const handleMouseDown = (r: number, c: number) => {
    if (isVisualizing) return;
    setIsMouseDown(true);

    if (r === startCoords.row && c === startCoords.col) {
      setIsDraggingStart(true);
      return;
    }
    if (r === endCoords.row && c === endCoords.col) {
      setIsDraggingEnd(true);
      return;
    }

    modifyNodeAt(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (!isMouseDown || isVisualizing) return;

    if (isDraggingStart) {
      if (r === endCoords.row && c === endCoords.col) return;
      setStartCoords({ row: r, col: c });
      setGrid((prev) =>
        prev.map((row) =>
          row.map((node) => ({
            ...node,
            isStart: node.row === r && node.col === c,
          }))
        )
      );
      return;
    }

    if (isDraggingEnd) {
      if (r === startCoords.row && c === startCoords.col) return;
      setEndCoords({ row: r, col: c });
      setGrid((prev) =>
        prev.map((row) =>
          row.map((node) => ({
            ...node,
            isEnd: node.row === r && node.col === c,
          }))
        )
      );
      return;
    }

    modifyNodeAt(r, c);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  };

  // Maze generator execution
  const handleGenerateMaze = (type: MazeType) => {
    handleClearBoard();
    setStatusMessage(`Generating ${type} maze...`);

    let walls: { row: number; col: number }[] = [];
    let weights: { row: number; col: number }[] = [];

    if (type === 'recursive-division') {
      walls = generateRecursiveDivision(grid, startCoords, endCoords);
    } else if (type === 'prims') {
      walls = generatePrimsMaze(grid, startCoords, endCoords);
    } else if (type === 'random-scatter') {
      const res = generateRandomScatter(grid, startCoords, endCoords);
      walls = res.walls;
      weights = res.weights;
    }

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      for (const w of walls) {
        if (
          !(w.row === startCoords.row && w.col === startCoords.col) &&
          !(w.row === endCoords.row && w.col === endCoords.col)
        ) {
          newGrid[w.row][w.col] = {
            ...newGrid[w.row][w.col],
            isWall: true,
            weight: 1,
          };
        }
      }
      for (const wt of weights) {
        if (
          !(wt.row === startCoords.row && wt.col === startCoords.col) &&
          !(wt.row === endCoords.row && wt.col === endCoords.col)
        ) {
          newGrid[wt.row][wt.col] = {
            ...newGrid[wt.row][wt.col],
            weight: 5,
            isWall: false,
          };
        }
      }
      return newGrid;
    });

    setStatusMessage(`${type} maze generated! Select algorithm and click Find Path.`);
  };

  // Algorithm Visualization Animation
  const handleVisualize = () => {
    handleClearPath();
    setIsVisualizing(true);
    setStatusMessage(`Running ${algorithm.toUpperCase()}...`);

    const result = runPathfindingAlgorithm(algorithm, grid, startCoords, endCoords);
    const { visitedNodesInOrder, nodesInShortestPathOrder, totalCost, pathLength, timeMs, found } =
      result;

    visitedNodesInOrder.forEach((node, idx) => {
      const t = setTimeout(() => {
        // Skip start and end nodes visually
        if (
          !(node.row === startCoords.row && node.col === startCoords.col) &&
          !(node.row === endCoords.row && node.col === endCoords.col)
        ) {
          setGrid((prev) => {
            const next = prev.map((row) => [...row]);
            next[node.row][node.col] = {
              ...next[node.row][node.col],
              isVisited: true,
            };
            return next;
          });
        }

        // Subtly play exploration tone every 6 nodes
        if (idx % 6 === 0) {
          soundEngine.playTone(node.row * 10 + node.col, NUM_ROWS * 10 + NUM_COLS, 15, 'sine');
        }

        // When visited search finishes
        if (idx === visitedNodesInOrder.length - 1) {
          if (found) {
            animateShortestPath(nodesInShortestPathOrder, totalCost, pathLength, timeMs);
          } else {
            setIsVisualizing(false);
            setStatusMessage('No valid path to destination! Destination is blocked by walls.');
            setTelemetry({
              nodesVisited: visitedNodesInOrder.length,
              pathLength: 0,
              totalCost: 0,
              timeMs,
              isComplete: true,
            });
          }
        }
      }, idx * speed);

      timeoutsRef.current.push(t);
    });
  };

  const animateShortestPath = (
    path: GridNode[],
    totalCost: number,
    pathLength: number,
    timeMs: number
  ) => {
    path.forEach((node, idx) => {
      const t = setTimeout(() => {
        if (
          !(node.row === startCoords.row && node.col === startCoords.col) &&
          !(node.row === endCoords.row && node.col === endCoords.col)
        ) {
          setGrid((prev) => {
            const next = prev.map((row) => [...row]);
            next[node.row][node.col] = {
              ...next[node.row][node.col],
              isPath: true,
            };
            return next;
          });
        }

        soundEngine.playTone(idx * 20 + 200, 800, 35, 'triangle');

        if (idx === path.length - 1) {
          setIsVisualizing(false);
          soundEngine.playCompletionFanfare();
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.75 },
          });
          setStatusMessage(
            `Target reached! Path Length: ${pathLength} steps | Cost: ${totalCost} | Time: ${timeMs}ms`
          );
          setTelemetry({
            nodesVisited: grid.flat().filter((n) => n.isVisited).length,
            pathLength,
            totalCost,
            timeMs,
            isComplete: true,
          });
        }
      }, idx * (speed * 1.8));

      timeoutsRef.current.push(t);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Telemetry HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Nodes Visited</span>
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {telemetry.nodesVisited.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Footprints className="w-4 h-4 text-amber-400" />
            <span>Path Length</span>
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {telemetry.pathLength} <span className="text-sm font-normal text-slate-400">steps</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>Total Path Cost</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {telemetry.totalCost}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Execution Time</span>
          </div>
          <div className="text-2xl font-black font-mono text-purple-400">
            {telemetry.timeMs} <span className="text-sm font-normal text-slate-400">ms</span>
          </div>
        </div>
      </div>

      {/* Interactive Grid */}
      <PathfindingGrid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
        toolMode={toolMode}
        isVisualizing={isVisualizing}
      />

      {/* Status banner */}
      <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>{statusMessage}</span>
        </span>
      </div>

      {/* Controls */}
      <PathfindingControls
        algorithm={algorithm}
        onSelectAlgorithm={(algo) => {
          setAlgorithm(algo);
          handleClearPath();
        }}
        toolMode={toolMode}
        onSelectToolMode={setToolMode}
        isVisualizing={isVisualizing}
        onVisualize={handleVisualize}
        onClearPath={handleClearPath}
        onClearBoard={handleClearBoard}
        onGenerateMaze={handleGenerateMaze}
        speed={speed}
        onChangeSpeed={setSpeed}
      />

      {/* Complexity & Theoretical Explanation */}
      <ComplexityCard pathfindingAlgorithm={algorithm} />
    </div>
  );
};
