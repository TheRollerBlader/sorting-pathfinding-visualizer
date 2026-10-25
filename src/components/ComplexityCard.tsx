import React from 'react';
import { SORTING_METADATA, PATHFINDING_METADATA } from '../constants/complexityData';
import { SortingAlgorithmType } from '../types/sorting';
import { PathfindingAlgorithmType } from '../types/pathfinding';
import { ShieldAlert, Cpu, Database, CheckCircle2, XCircle, Code2 } from 'lucide-react';

interface ComplexityCardProps {
  sortingAlgorithm?: SortingAlgorithmType;
  pathfindingAlgorithm?: PathfindingAlgorithmType;
}

export const ComplexityCard: React.FC<ComplexityCardProps> = ({
  sortingAlgorithm,
  pathfindingAlgorithm,
}) => {
  if (sortingAlgorithm) {
    const meta = SORTING_METADATA[sortingAlgorithm];
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{meta.name}</span>
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                {meta.category}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">{meta.description}</p>
          </div>
        </div>

        {/* Complexity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Best Case</span>
            <span className="text-base font-bold font-mono text-emerald-400">{meta.timeComplexity.best}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Average Case</span>
            <span className="text-base font-bold font-mono text-cyan-400">{meta.timeComplexity.average}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Worst Case</span>
            <span className="text-base font-bold font-mono text-amber-400">{meta.timeComplexity.worst}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Space (Auxiliary)</span>
            <span className="text-base font-bold font-mono text-purple-400">{meta.spaceComplexity}</span>
          </div>
        </div>

        {/* Properties pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            {meta.stable ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>Stable: <strong>{meta.stable ? 'Yes' : 'No'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            {meta.inPlace ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>In-Place: <strong>{meta.inPlace ? 'Yes' : 'No'}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  if (pathfindingAlgorithm) {
    const meta = PATHFINDING_METADATA[pathfindingAlgorithm];
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{meta.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">{meta.description}</p>
          </div>
        </div>

        {/* Complexity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Time Complexity</span>
            <span className="text-base font-bold font-mono text-cyan-400">{meta.timeComplexity}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Space Complexity</span>
            <span className="text-base font-bold font-mono text-purple-400">{meta.spaceComplexity}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Weighted Support</span>
            <span className="text-base font-bold font-mono text-emerald-400">{meta.weighted ? 'Supported' : 'Unweighted'}</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Shortest Path</span>
            <span className="text-base font-bold font-mono text-amber-400">{meta.guaranteesShortestPath ? 'Guaranteed' : 'Heuristic'}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
