import React from 'react';
import {
  Play,
  RotateCcw,
  Eraser,
  PenTool,
  TreePine,
  Grid,
  Sparkles,
  Sliders,
  Gauge,
  Layers,
} from 'lucide-react';
import { PathfindingAlgorithmType, ToolMode, MazeType } from '../../types/pathfinding';

interface PathfindingControlsProps {
  algorithm: PathfindingAlgorithmType;
  onSelectAlgorithm: (algo: PathfindingAlgorithmType) => void;
  toolMode: ToolMode;
  onSelectToolMode: (mode: ToolMode) => void;
  isVisualizing: boolean;
  onVisualize: () => void;
  onClearPath: () => void;
  onClearBoard: () => void;
  onGenerateMaze: (type: MazeType) => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
}

export const PathfindingControls: React.FC<PathfindingControlsProps> = ({
  algorithm,
  onSelectAlgorithm,
  toolMode,
  onSelectToolMode,
  isVisualizing,
  onVisualize,
  onClearPath,
  onClearBoard,
  onGenerateMaze,
  speed,
  onChangeSpeed,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
      {/* Top Row: Algorithm Selection */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-white">Algorithm:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'bfs', label: 'BFS' },
              { id: 'dfs', label: 'DFS' },
              { id: 'dijkstra', label: 'Dijkstra' },
              { id: 'astar', label: 'A* Search' },
              { id: 'greedy', label: 'Greedy BFS' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              disabled={isVisualizing}
              onClick={() => onSelectAlgorithm(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                algorithm === item.id
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Second Row: Interactive Tools & Maze Generation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        {/* Play & Reset buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onVisualize}
            disabled={isVisualizing}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-500 text-white font-bold text-xs sm:text-sm hover:bg-indigo-400 transition-all shadow-md shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isVisualizing ? 'Visualizing...' : 'Find Path'}</span>
          </button>

          <button
            onClick={onClearPath}
            disabled={isVisualizing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium hover:text-white hover:border-slate-700 disabled:opacity-40 transition-all"
            title="Clear Visited & Path"
          >
            <span>Clear Path</span>
          </button>

          <button
            onClick={onClearBoard}
            disabled={isVisualizing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium hover:text-white hover:border-slate-700 disabled:opacity-40 transition-all"
            title="Clear Entire Board (Walls + Terrain)"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Clear Board</span>
          </button>
        </div>

        {/* Brush Tool Selector */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onSelectToolMode('wall')}
            disabled={isVisualizing}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              toolMode === 'wall'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Draw Walls"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Wall</span>
          </button>

          <button
            onClick={() => onSelectToolMode('weight')}
            disabled={isVisualizing}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              toolMode === 'weight'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Draw Terrain (Weight: 5x)"
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>Terrain (5x)</span>
          </button>

          <button
            onClick={() => onSelectToolMode('eraser')}
            disabled={isVisualizing}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              toolMode === 'eraser'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Erase cell"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Eraser</span>
          </button>
        </div>

        {/* Maze Generators */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Maze:
          </span>
          <button
            onClick={() => onGenerateMaze('recursive-division')}
            disabled={isVisualizing}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 disabled:opacity-40"
          >
            Recursive Division
          </button>
          <button
            onClick={() => onGenerateMaze('prims')}
            disabled={isVisualizing}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 disabled:opacity-40"
          >
            Prim's Maze
          </button>
          <button
            onClick={() => onGenerateMaze('random-scatter')}
            disabled={isVisualizing}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 disabled:opacity-40"
          >
            Random Obstacles
          </button>
        </div>
      </div>

      {/* Speed Slider */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Gauge className="w-3.5 h-3.5 text-indigo-400" />
          <span>Animation Speed:</span>
          <span className="font-mono text-indigo-400 font-bold">{speed} ms</span>
        </div>
        <div className="w-48 sm:w-64">
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={speed}
            onChange={(e) => onChangeSpeed(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
