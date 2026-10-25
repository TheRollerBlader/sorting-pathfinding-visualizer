import React, { useState } from 'react';
import { Volume2, VolumeX, BarChart3, Compass, Swords, Sparkles, Code2 } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

export type AppMode = 'sorting' | 'pathfinding' | 'race';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentMode, onSelectMode }) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const handleToggleSound = () => {
    const nextState = soundEngine.toggleMute();
    setIsMuted(nextState);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                AlgoScope
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive Sorting & Pathfinding Algorithm Visualizer
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <nav className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => onSelectMode('sorting')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              currentMode === 'sorting'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Sorting</span>
          </button>

          <button
            onClick={() => onSelectMode('pathfinding')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              currentMode === 'pathfinding'
                ? 'bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Pathfinding</span>
          </button>

          <button
            onClick={() => onSelectMode('race')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              currentMode === 'race'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Race Arena</span>
          </button>
        </nav>

        {/* Audio Toggle & GitHub */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Web Audio' : 'Mute Web Audio'}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300'
                : 'border-cyan-500/40 bg-cyan-950/40 text-cyan-400 shadow-sm shadow-cyan-500/20'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <a
            href="https://github.com/TheRollerBlader/sorting-pathfinding-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-all hidden sm:flex"
            title="View on GitHub"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
