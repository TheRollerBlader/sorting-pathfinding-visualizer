import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Shuffle,
  Sliders,
  Gauge,
} from 'lucide-react';
import { SortingAlgorithmType } from '../../types/sorting';

export type ArrayPreset = 'random' | 'reversed' | 'nearly-sorted' | 'few-unique';

interface SortingControlsProps {
  algorithm: SortingAlgorithmType;
  onSelectAlgorithm: (algo: SortingAlgorithmType) => void;
  isRunning: boolean;
  isCompleted: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onGenerateArray: (preset: ArrayPreset) => void;
  arraySize: number;
  onChangeArraySize: (size: number) => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
}

export const SortingControls: React.FC<SortingControlsProps> = ({
  algorithm,
  onSelectAlgorithm,
  isRunning,
  isCompleted,
  onPlay,
  onPause,
  onStepForward,
  onReset,
  onGenerateArray,
  arraySize,
  onChangeArraySize,
  speed,
  onChangeSpeed,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
      {/* Top Row: Algorithm Selection */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Algorithm:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'bubble', label: 'Bubble' },
              { id: 'insertion', label: 'Insertion' },
              { id: 'selection', label: 'Selection' },
              { id: 'merge', label: 'Merge' },
              { id: 'quick', label: 'Quick' },
              { id: 'heap', label: 'Heap' },
              { id: 'radix', label: 'Radix' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              disabled={isRunning}
              onClick={() => onSelectAlgorithm(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                algorithm === item.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Middle Row: Playback Controls & Array Presets */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        {/* Play / Step / Reset */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={isCompleted}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isCompleted ? 'Sorted' : 'Start Sorting'}</span>
            </button>
          )}

          <button
            onClick={onStepForward}
            disabled={isRunning || isCompleted}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Step Forward One Operation"
          >
            <SkipForward className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Step</span>
          </button>

          <button
            onClick={onReset}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Reset Array"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Array Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Shuffle className="w-3.5 h-3.5" /> Preset:
          </span>
          {(
            [
              { id: 'random', label: 'Random' },
              { id: 'nearly-sorted', label: 'Nearly Sorted' },
              { id: 'reversed', label: 'Reversed' },
              { id: 'few-unique', label: 'Few Unique' },
            ] as const
          ).map((preset) => (
            <button
              key={preset.id}
              disabled={isRunning}
              onClick={() => onGenerateArray(preset.id)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 disabled:opacity-40 transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Row: Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
        {/* Speed Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Delay / Speed:
            </span>
            <span className="font-mono text-cyan-400 font-bold">{speed} ms</span>
          </div>
          <input
            type="range"
            min="1"
            max="120"
            step="1"
            value={speed}
            onChange={(e) => onChangeSpeed(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Array Size Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Array Size (Elements):</span>
            <span className="font-mono text-purple-400 font-bold">{arraySize}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            disabled={isRunning}
            value={arraySize}
            onChange={(e) => onChangeArraySize(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg disabled:opacity-40"
          />
        </div>
      </div>
    </div>
  );
};
