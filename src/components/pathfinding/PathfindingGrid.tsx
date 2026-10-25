import React from 'react';
import { GridNode, ToolMode } from '../../types/pathfinding';
import { MapPin, Target, TreePine } from 'lucide-react';

interface PathfindingGridProps {
  grid: GridNode[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  toolMode: ToolMode;
  isVisualizing: boolean;
}

export const PathfindingGrid: React.FC<PathfindingGridProps> = ({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  toolMode,
  isVisualizing,
}) => {
  return (
    <div
      className="relative select-none overflow-x-auto p-4 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center cursor-crosshair"
      onMouseLeave={onMouseUp}
    >
      <div
        className="grid gap-[1px] bg-slate-900 border border-slate-800/80 rounded-lg p-1"
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))`,
        }}
        onMouseUp={onMouseUp}
      >
        {grid.map((row, rIdx) =>
          row.map((node, cIdx) => {
            let cellStyle = 'bg-slate-950 hover:bg-slate-800/80 border-slate-900/60';
            let content = null;

            if (node.isStart) {
              cellStyle = 'bg-emerald-500 shadow-md shadow-emerald-500/50 text-slate-950 scale-105 z-10';
              content = <MapPin className="w-3.5 h-3.5 fill-current" />;
            } else if (node.isEnd) {
              cellStyle = 'bg-rose-500 shadow-md shadow-rose-500/50 text-white scale-105 z-10';
              content = <Target className="w-3.5 h-3.5" />;
            } else if (node.isPath) {
              cellStyle = 'node-path-anim';
            } else if (node.isVisited) {
              cellStyle = 'node-visited-anim';
            } else if (node.isWall) {
              cellStyle = 'bg-slate-700 border-slate-600 scale-95 shadow-inner shadow-black';
            } else if (node.weight > 1) {
              cellStyle = 'bg-amber-950/50 border-amber-800/50 text-amber-400';
              content = <TreePine className="w-3 h-3 text-amber-400" />;
            }

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                id={`node-${rIdx}-${cIdx}`}
                onMouseDown={() => !isVisualizing && onMouseDown(rIdx, cIdx)}
                onMouseEnter={() => !isVisualizing && onMouseEnter(rIdx, cIdx)}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-[3px] border text-[9px] flex items-center justify-center font-mono font-bold transition-transform duration-150 ${cellStyle}`}
              >
                {content}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
