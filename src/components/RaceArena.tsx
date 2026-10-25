import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { SortingAlgorithmType, SortStep } from '../types/sorting';
import { PathfindingAlgorithmType, GridNode } from '../types/pathfinding';
import { getSortingGenerator } from '../algorithms/sorting';
import { runPathfindingAlgorithm } from '../algorithms/pathfinding';
import { generateRecursiveDivision } from '../algorithms/pathfinding/mazeGenerators';
import { SortingCanvas } from './sorting/SortingCanvas';
import { BenchmarkChart, BenchmarkItem } from './BenchmarkChart';
import { soundEngine } from '../audio/soundEngine';
import {
  Swords,
  Play,
  RotateCcw,
  Trophy,
  Medal,
  Clock,
  Activity,
  Layers,
  Sparkles,
  Compass,
} from 'lucide-react';

export const RaceArena: React.FC = () => {
  const [raceCategory, setRaceCategory] = useState<'sorting' | 'pathfinding'>('sorting');

  // Sorting Race State
  const [sortAlgo1, setSortAlgo1] = useState<SortingAlgorithmType>('quick');
  const [sortAlgo2, setSortAlgo2] = useState<SortingAlgorithmType>('merge');
  const [sortAlgo3, setSortAlgo3] = useState<SortingAlgorithmType>('heap');
  const [activeLaneCount, setActiveLaneCount] = useState<2 | 3>(3);

  const [sortStep1, setSortStep1] = useState<SortStep | null>(null);
  const [sortStep2, setSortStep2] = useState<SortStep | null>(null);
  const [sortStep3, setSortStep3] = useState<SortStep | null>(null);

  const [sortFinished, setSortFinished] = useState<boolean[]>([false, false, false]);
  const [finishOrder, setFinishOrder] = useState<string[]>([]);
  const [isSortingRacing, setIsSortingRacing] = useState<boolean>(false);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkItem[]>([]);

  // Telemetry for sorting racers
  const [sortTime1, setSortTime1] = useState(0);
  const [sortTime2, setSortTime2] = useState(0);
  const [sortTime3, setSortTime3] = useState(0);

  const gen1Ref = useRef<Generator<SortStep, void, unknown> | null>(null);
  const gen2Ref = useRef<Generator<SortStep, void, unknown> | null>(null);
  const gen3Ref = useRef<Generator<SortStep, void, unknown> | null>(null);

  const startTimesRef = useRef<number[]>([0, 0, 0]);
  const initialArrayRef = useRef<number[]>([]);
  const sortAnimFrameRef = useRef<number | null>(null);

  // Initialize sorting race array
  const initSortingRace = useCallback(() => {
    if (sortAnimFrameRef.current) cancelAnimationFrame(sortAnimFrameRef.current);
    setIsSortingRacing(false);
    setSortFinished([false, false, false]);
    setFinishOrder([]);
    setSortTime1(0);
    setSortTime2(0);
    setSortTime3(0);

    const size = 35;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 280) + 20);
    initialArrayRef.current = [...arr];

    const stepInitial: SortStep = {
      array: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      comparisons: 0,
      swaps: 0,
      accesses: 0,
    };

    setSortStep1({ ...stepInitial });
    setSortStep2({ ...stepInitial });
    setSortStep3({ ...stepInitial });

    gen1Ref.current = null;
    gen2Ref.current = null;
    gen3Ref.current = null;
  }, []);

  useEffect(() => {
    initSortingRace();
  }, [initSortingRace]);

  // Run Sorting Race Loop
  const startSortingRace = () => {
    if (isSortingRacing) return;

    gen1Ref.current = getSortingGenerator(sortAlgo1, [...initialArrayRef.current]);
    gen2Ref.current = getSortingGenerator(sortAlgo2, [...initialArrayRef.current]);
    gen3Ref.current = getSortingGenerator(sortAlgo3, [...initialArrayRef.current]);

    const now = performance.now();
    startTimesRef.current = [now, now, now];
    setIsSortingRacing(true);
    setSortFinished([false, false, false]);
    setFinishOrder([]);

    const finished = [false, false, false];
    const order: string[] = [];
    const benchResults: BenchmarkItem[] = [];

    const racers = [
      { id: sortAlgo1, name: sortAlgo1.toUpperCase(), gen: gen1Ref, setStep: setSortStep1, setTime: setSortTime1 },
      { id: sortAlgo2, name: sortAlgo2.toUpperCase(), gen: gen2Ref, setStep: setSortStep2, setTime: setSortTime2 },
      { id: sortAlgo3, name: sortAlgo3.toUpperCase(), gen: gen3Ref, setStep: setSortStep3, setTime: setSortTime3 },
    ];

    const tick = () => {
      let anyActive = false;
      const count = activeLaneCount;

      for (let i = 0; i < count; i++) {
        if (!finished[i] && racers[i].gen.current) {
          const res = racers[i].gen.current!.next();
          if (res.done) {
            finished[i] = true;
            const elapsed = Math.round(performance.now() - startTimesRef.current[i]);
            racers[i].setTime(elapsed);
            order.push(racers[i].name);

            // Record benchmark metrics
            let currentStepObj = i === 0 ? sortStep1 : i === 1 ? sortStep2 : sortStep3;
            benchResults.push({
              name: racers[i].name,
              timeMs: elapsed,
              operations: currentStepObj?.swaps || 0,
              comparisons: currentStepObj?.comparisons || 0,
            });
          } else {
            anyActive = true;
            racers[i].setStep(res.value);
            const elapsed = Math.round(performance.now() - startTimesRef.current[i]);
            racers[i].setTime(elapsed);
          }
        }
      }

      setSortFinished([...finished]);
      setFinishOrder([...order]);

      if (anyActive) {
        sortAnimFrameRef.current = requestAnimationFrame(tick);
      } else {
        setIsSortingRacing(false);
        setBenchmarkData([...benchResults]);
        soundEngine.playCompletionFanfare();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    };

    sortAnimFrameRef.current = requestAnimationFrame(tick);
  };

  // Pathfinding Race State
  const [pathAlgo1, setPathAlgo1] = useState<PathfindingAlgorithmType>('astar');
  const [pathAlgo2, setPathAlgo2] = useState<PathfindingAlgorithmType>('dijkstra');
  const [pathAlgo3, setPathAlgo3] = useState<PathfindingAlgorithmType>('bfs');

  const [pathResults, setPathResults] = useState<{
    time1: number;
    time2: number;
    time3: number;
    cost1: number;
    cost2: number;
    cost3: number;
    visited1: number;
    visited2: number;
    visited3: number;
    winner: string;
  } | null>(null);

  const startPathfindingRace = () => {
    // Generate a test grid with obstacles
    const rows = 17;
    const cols = 25;
    const start = { row: 8, col: 2 };
    const end = { row: 8, col: 22 };

    const grid: GridNode[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        row: r,
        col: c,
        isStart: r === start.row && c === start.col,
        isEnd: r === end.row && c === end.col,
        isWall: false,
        weight: 1,
        distance: Infinity,
        heuristic: 0,
        totalCost: Infinity,
        isVisited: false,
        isPath: false,
        previousNode: null,
      }))
    );

    // Apply recursive division walls
    const walls = generateRecursiveDivision(grid, start, end);
    for (const w of walls) {
      grid[w.row][w.col].isWall = true;
    }

    const r1 = runPathfindingAlgorithm(pathAlgo1, grid, start, end);
    const r2 = runPathfindingAlgorithm(pathAlgo2, grid, start, end);
    const r3 = runPathfindingAlgorithm(pathAlgo3, grid, start, end);

    // Identify winner by shortest path cost first, then time
    let winnerName = pathAlgo1.toUpperCase();
    if (r2.totalCost < r1.totalCost || (r2.totalCost === r1.totalCost && r2.timeMs < r1.timeMs)) {
      winnerName = pathAlgo2.toUpperCase();
    }
    if (
      activeLaneCount === 3 &&
      (r3.totalCost < r2.totalCost || (r3.totalCost === r2.totalCost && r3.timeMs < r2.timeMs))
    ) {
      winnerName = pathAlgo3.toUpperCase();
    }

    setPathResults({
      time1: r1.timeMs,
      time2: r2.timeMs,
      time3: r3.timeMs,
      cost1: r1.totalCost,
      cost2: r2.totalCost,
      cost3: r3.totalCost,
      visited1: r1.nodesVisitedCount,
      visited2: r2.nodesVisitedCount,
      visited3: r3.nodesVisitedCount,
      winner: winnerName,
    });

    const bench: BenchmarkItem[] = [
      { name: pathAlgo1.toUpperCase(), timeMs: r1.timeMs, operations: r1.nodesVisitedCount, cost: r1.totalCost },
      { name: pathAlgo2.toUpperCase(), timeMs: r2.timeMs, operations: r2.nodesVisitedCount, cost: r2.totalCost },
    ];
    if (activeLaneCount === 3) {
      bench.push({ name: pathAlgo3.toUpperCase(), timeMs: r3.timeMs, operations: r3.nodesVisitedCount, cost: r3.totalCost });
    }
    setBenchmarkData(bench);

    soundEngine.playCompletionFanfare();
    confetti({
      particleCount: 75,
      spread: 75,
      origin: { y: 0.65 },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Multi-Algorithm Arena</h3>
            <p className="text-xs text-slate-400">
              Run algorithms simultaneously on identical inputs in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Lanes toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveLaneCount(2)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeLaneCount === 2 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              2 Racers
            </button>
            <button
              onClick={() => setActiveLaneCount(3)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeLaneCount === 3 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              3 Racers
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                setRaceCategory('sorting');
                setBenchmarkData([]);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                raceCategory === 'sorting'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sorting Race
            </button>
            <button
              onClick={() => {
                setRaceCategory('pathfinding');
                setBenchmarkData([]);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                raceCategory === 'pathfinding'
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pathfinding Race
            </button>
          </div>
        </div>
      </div>

      {/* Winner Podium Banner */}
      {finishOrder.length > 0 && raceCategory === 'sorting' && (
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border border-amber-500/40 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                Race Champion
              </span>
              <h4 className="text-lg font-black text-white">
                {finishOrder[0]} won 1st Place! 🥇
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            {finishOrder.map((name, idx) => (
              <span
                key={name}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
              >
                #{idx + 1} {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {pathResults && raceCategory === 'pathfinding' && (
        <div className="bg-gradient-to-r from-indigo-500/20 via-slate-900 to-indigo-500/20 border border-indigo-500/40 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-indigo-400 animate-bounce" />
            <div>
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
                Most Optimal Path
              </span>
              <h4 className="text-lg font-black text-white">
                {pathResults.winner} conquered the maze! 🏆
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* Race View for Sorting */}
      {raceCategory === 'sorting' && (
        <div className="flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Algo 1 Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-slate-400">Racer 1:</span>
                <select
                  value={sortAlgo1}
                  disabled={isSortingRacing}
                  onChange={(e) => setSortAlgo1(e.target.value as SortingAlgorithmType)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-cyan-500"
                >
                  <option value="quick">Quick Sort</option>
                  <option value="merge">Merge Sort</option>
                  <option value="heap">Heap Sort</option>
                  <option value="bubble">Bubble Sort</option>
                  <option value="insertion">Insertion Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="radix">Radix Sort</option>
                </select>
              </div>

              {/* Algo 2 Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span className="text-slate-400">Racer 2:</span>
                <select
                  value={sortAlgo2}
                  disabled={isSortingRacing}
                  onChange={(e) => setSortAlgo2(e.target.value as SortingAlgorithmType)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="merge">Merge Sort</option>
                  <option value="quick">Quick Sort</option>
                  <option value="heap">Heap Sort</option>
                  <option value="bubble">Bubble Sort</option>
                  <option value="insertion">Insertion Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="radix">Radix Sort</option>
                </select>
              </div>

              {/* Algo 3 Selector */}
              {activeLaneCount === 3 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-400">Racer 3:</span>
                  <select
                    value={sortAlgo3}
                    disabled={isSortingRacing}
                    onChange={(e) => setSortAlgo3(e.target.value as SortingAlgorithmType)}
                    className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="heap">Heap Sort</option>
                    <option value="quick">Quick Sort</option>
                    <option value="merge">Merge Sort</option>
                    <option value="bubble">Bubble Sort</option>
                    <option value="insertion">Insertion Sort</option>
                    <option value="selection">Selection Sort</option>
                    <option value="radix">Radix Sort</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startSortingRace}
                disabled={isSortingRacing}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 disabled:opacity-40"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isSortingRacing ? 'Racing...' : 'Launch Race'}</span>
              </button>

              <button
                onClick={initSortingRace}
                disabled={isSortingRacing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Side-by-side Visual Canvases */}
          <div
            className={`grid gap-4 ${
              activeLaneCount === 3 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {/* Lane 1 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-sm text-cyan-400 uppercase tracking-wider">
                  #1 {sortAlgo1}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {sortTime1} ms | {sortStep1?.comparisons || 0} cmp
                </span>
              </div>
              <SortingCanvas currentStep={sortStep1} maxValue={300} />
            </div>

            {/* Lane 2 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-sm text-indigo-400 uppercase tracking-wider">
                  #2 {sortAlgo2}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {sortTime2} ms | {sortStep2?.comparisons || 0} cmp
                </span>
              </div>
              <SortingCanvas currentStep={sortStep2} maxValue={300} />
            </div>

            {/* Lane 3 */}
            {activeLaneCount === 3 && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-sm text-amber-400 uppercase tracking-wider">
                    #3 {sortAlgo3}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {sortTime3} ms | {sortStep3?.comparisons || 0} cmp
                  </span>
                </div>
                <SortingCanvas currentStep={sortStep3} maxValue={300} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Race View for Pathfinding */}
      {raceCategory === 'pathfinding' && (
        <div className="flex flex-col gap-6">
          {/* Pathfinding Race Selectors & Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Algo 1:</span>
                <select
                  value={pathAlgo1}
                  onChange={(e) => setPathAlgo1(e.target.value as PathfindingAlgorithmType)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs font-semibold"
                >
                  <option value="astar">A* Search</option>
                  <option value="dijkstra">Dijkstra</option>
                  <option value="greedy">Greedy BFS</option>
                  <option value="bfs">BFS</option>
                  <option value="dfs">DFS</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Algo 2:</span>
                <select
                  value={pathAlgo2}
                  onChange={(e) => setPathAlgo2(e.target.value as PathfindingAlgorithmType)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs font-semibold"
                >
                  <option value="dijkstra">Dijkstra</option>
                  <option value="astar">A* Search</option>
                  <option value="greedy">Greedy BFS</option>
                  <option value="bfs">BFS</option>
                  <option value="dfs">DFS</option>
                </select>
              </div>

              {activeLaneCount === 3 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400">Algo 3:</span>
                  <select
                    value={pathAlgo3}
                    onChange={(e) => setPathAlgo3(e.target.value as PathfindingAlgorithmType)}
                    className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs font-semibold"
                  >
                    <option value="bfs">BFS</option>
                    <option value="astar">A* Search</option>
                    <option value="dijkstra">Dijkstra</option>
                    <option value="greedy">Greedy BFS</option>
                    <option value="dfs">DFS</option>
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={startPathfindingRace}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:brightness-110"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Simulate Pathfinding Race</span>
            </button>
          </div>

          {/* Pathfinding Stat Cards */}
          {pathResults && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">
                  {pathAlgo1.toUpperCase()}
                </h4>
                <div className="space-y-1 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Execution Time:</span>
                    <span className="text-cyan-400 font-bold">{pathResults.time1} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nodes Visited:</span>
                    <span className="text-purple-400 font-bold">{pathResults.visited1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Path Cost:</span>
                    <span className="text-emerald-400 font-bold">{pathResults.cost1}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">
                  {pathAlgo2.toUpperCase()}
                </h4>
                <div className="space-y-1 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Execution Time:</span>
                    <span className="text-cyan-400 font-bold">{pathResults.time2} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nodes Visited:</span>
                    <span className="text-purple-400 font-bold">{pathResults.visited2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Path Cost:</span>
                    <span className="text-emerald-400 font-bold">{pathResults.cost2}</span>
                  </div>
                </div>
              </div>

              {activeLaneCount === 3 && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
                  <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">
                    {pathAlgo3.toUpperCase()}
                  </h4>
                  <div className="space-y-1 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Execution Time:</span>
                      <span className="text-cyan-400 font-bold">{pathResults.time3} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nodes Visited:</span>
                      <span className="text-purple-400 font-bold">{pathResults.visited3}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Path Cost:</span>
                      <span className="text-emerald-400 font-bold">{pathResults.cost3}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Post-Race Benchmark Chart */}
      {benchmarkData.length > 0 && (
        <BenchmarkChart
          title="Post-Race Telemetry Comparison"
          subtitle="Relative algorithm benchmark on identical inputs"
          data={benchmarkData}
          metricType={raceCategory}
        />
      )}
    </div>
  );
};
