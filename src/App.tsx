import React, { useState } from 'react';
import { Navbar, AppMode } from './components/Navbar';
import { SortingVisualizer } from './components/sorting/SortingVisualizer';
import { PathfindingVisualizer } from './components/pathfinding/PathfindingVisualizer';
import { RaceArena } from './components/RaceArena';
import { Sparkles, Terminal, Activity, Layers, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('sorting');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Navbar */}
      <Navbar currentMode={currentMode} onSelectMode={setCurrentMode} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-850">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Algorithmic Telemetry & Asymptotic Analysis Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentMode === 'sorting' && 'Sorting Algorithm Visualizer'}
              {currentMode === 'pathfinding' && 'Graph & Pathfinding Engine'}
              {currentMode === 'race' && 'Side-by-Side Algorithm Race Arena'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {currentMode === 'sorting' &&
                'Explore comparison and distribution sorts with real-time audio synthesis, visual state encoding, and time/space complexity cards.'}
              {currentMode === 'pathfinding' &&
                'Traverse weighted graphs, explore heuristics, sculpt custom mazes with recursive division, and observe optimal path cost convergence.'}
              {currentMode === 'race' &&
                'Pit sorting or pathfinding algorithms against one another simultaneously on identical inputs with automated benchmark analytics.'}
            </p>
          </div>
        </div>

        {/* Dynamic Mode Content */}
        {currentMode === 'sorting' && <SortingVisualizer />}
        {currentMode === 'pathfinding' && <PathfindingVisualizer />}
        {currentMode === 'race' && <RaceArena />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 px-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">AlgoScope</span>
            <span>•</span>
            <span>Web Audio API & HTML5 Canvas Engine</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Built with React, TypeScript, Tailwind CSS, & Recharts</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
