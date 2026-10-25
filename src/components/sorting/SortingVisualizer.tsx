import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { SortingAlgorithmType, SortStep, SortingTelemetry } from '../../types/sorting';
import { getSortingGenerator } from '../../algorithms/sorting';
import { SortingCanvas } from './SortingCanvas';
import { SortingControls, ArrayPreset } from './SortingControls';
import { ComplexityCard } from '../ComplexityCard';
import { soundEngine } from '../../audio/soundEngine';
import { Activity, Clock, ArrowUpDown, Eye } from 'lucide-react';

export const SortingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithmType>('quick');
  const [arraySize, setArraySize] = useState<number>(45);
  const [speed, setSpeed] = useState<number>(25);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [currentStep, setCurrentStep] = useState<SortStep | null>(null);
  const [telemetry, setTelemetry] = useState<SortingTelemetry>({
    comparisons: 0,
    swaps: 0,
    accesses: 0,
    timeMs: 0,
    isComplete: false,
  });

  const generatorRef = useRef<Generator<SortStep, void, unknown> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const baseArrayRef = useRef<number[]>([]);

  // Array generation helpers
  const generateArray = useCallback((size: number, preset: ArrayPreset = 'random') => {
    let arr: number[] = [];
    const minVal = 10;
    const maxVal = 300;

    switch (preset) {
      case 'random':
        arr = Array.from({ length: size }, () =>
          Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
        );
        break;
      case 'reversed':
        arr = Array.from({ length: size }, (_, i) =>
          Math.floor(maxVal - (i / size) * (maxVal - minVal))
        );
        break;
      case 'nearly-sorted':
        arr = Array.from({ length: size }, (_, i) =>
          Math.floor(minVal + (i / size) * (maxVal - minVal))
        );
        // Perturb 10% of items
        for (let i = 0; i < Math.max(2, Math.floor(size * 0.1)); i++) {
          const idx1 = Math.floor(Math.random() * size);
          const idx2 = Math.floor(Math.random() * size);
          [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
        }
        break;
      case 'few-unique': {
        const uniquePool = [30, 80, 150, 220, 290];
        arr = Array.from({ length: size }, () =>
          uniquePool[Math.floor(Math.random() * uniquePool.length)]
        );
        break;
      }
    }

    baseArrayRef.current = [...arr];
    generatorRef.current = null;
    setIsRunning(false);
    setIsCompleted(false);

    const initialStep: SortStep = {
      array: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      comparisons: 0,
      swaps: 0,
      accesses: 0,
      description: `Generated ${preset} array with ${size} elements.`,
    };
    setCurrentStep(initialStep);
    setTelemetry({
      comparisons: 0,
      swaps: 0,
      accesses: 0,
      timeMs: 0,
      isComplete: false,
    });
  }, []);

  // Initialize on mount or when arraySize changes
  useEffect(() => {
    generateArray(arraySize, 'random');
  }, [arraySize, generateArray]);

  // Audio tone trigger
  const playSoundForStep = (step: SortStep) => {
    const max = 300;
    if (step.swappingIndices.length > 0) {
      const idx = step.swappingIndices[0];
      const val = step.array[idx] || 150;
      soundEngine.playTone(val, max, 30, 'square');
    } else if (step.comparingIndices.length > 0) {
      const idx = step.comparingIndices[0];
      const val = step.array[idx] || 150;
      soundEngine.playTone(val, max, 25, 'triangle');
    }
  };

  // Step logic
  const stepForward = useCallback(() => {
    if (!generatorRef.current) {
      if (!currentStep) return false;
      generatorRef.current = getSortingGenerator(algorithm, [...currentStep.array]);
      startTimeRef.current = performance.now();
    }

    const res = generatorRef.current.next();
    if (res.done) {
      setIsRunning(false);
      setIsCompleted(true);
      soundEngine.playCompletionFanfare();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      return false;
    }

    const step = res.value;
    setCurrentStep(step);
    playSoundForStep(step);

    const elapsed = Math.round(performance.now() - startTimeRef.current);
    setTelemetry({
      comparisons: step.comparisons,
      swaps: step.swaps,
      accesses: step.accesses,
      timeMs: elapsed,
      isComplete: false,
    });
    return true;
  }, [algorithm, currentStep]);

  // Animation Loop
  useEffect(() => {
    if (!isRunning) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const tick = (now: number) => {
      if (!lastStepTimeRef.current) lastStepTimeRef.current = now;
      const delta = now - lastStepTimeRef.current;

      if (delta >= speed) {
        lastStepTimeRef.current = now;
        const hasMore = stepForward();
        if (!hasMore) {
          setIsRunning(false);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, speed, stepForward]);

  const handlePlay = () => {
    if (isCompleted) return;
    if (!generatorRef.current && currentStep) {
      generatorRef.current = getSortingGenerator(algorithm, [...currentStep.array]);
      startTimeRef.current = performance.now();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    generatorRef.current = null;
    const initialStep: SortStep = {
      array: [...baseArrayRef.current],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      comparisons: 0,
      swaps: 0,
      accesses: 0,
      description: 'Reset to initial array order.',
    };
    setCurrentStep(initialStep);
    setTelemetry({
      comparisons: 0,
      swaps: 0,
      accesses: 0,
      timeMs: 0,
      isComplete: false,
    });
  };

  const handleSelectAlgorithm = (algo: SortingAlgorithmType) => {
    setAlgorithm(algo);
    handleReset();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Telemetry HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Comparisons</span>
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {telemetry.comparisons.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <ArrowUpDown className="w-4 h-4 text-rose-400" />
            <span>Swaps / Writes</span>
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">
            {telemetry.swaps.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Array Accesses</span>
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {telemetry.accesses.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Elapsed Time</span>
          </div>
          <div className="text-2xl font-black font-mono text-purple-400">
            {telemetry.timeMs} <span className="text-sm font-normal text-slate-400">ms</span>
          </div>
        </div>
      </div>

      {/* Visual Canvas */}
      <SortingCanvas currentStep={currentStep} maxValue={300} />

      {/* Description / Step message banner */}
      {currentStep?.description && (
        <div className="bg-slate-900/80 border border-slate-800/80 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{currentStep.description}</span>
          </span>
          {isCompleted && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/40">
              Completed
            </span>
          )}
        </div>
      )}

      {/* Controls */}
      <SortingControls
        algorithm={algorithm}
        onSelectAlgorithm={handleSelectAlgorithm}
        isRunning={isRunning}
        isCompleted={isCompleted}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={stepForward}
        onReset={handleReset}
        onGenerateArray={(preset) => generateArray(arraySize, preset)}
        arraySize={arraySize}
        onChangeArraySize={setArraySize}
        speed={speed}
        onChangeSpeed={setSpeed}
      />

      {/* Complexity & Theoretical Explanation */}
      <ComplexityCard sortingAlgorithm={algorithm} />
    </div>
  );
};
