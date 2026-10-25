import React, { useEffect, useRef } from 'react';
import { SortStep } from '../../types/sorting';

interface SortingCanvasProps {
  currentStep: SortStep | null;
  maxValue: number;
}

export const SortingCanvas: React.FC<SortingCanvasProps> = ({ currentStep, maxValue }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentStep) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = '#151d2e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = height; y > 0; y -= 40) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    const arr = currentStep.array;
    const n = arr.length;
    const barSpacing = n > 60 ? 1 : n > 35 ? 2 : 4;
    const totalSpacing = barSpacing * (n - 1);
    const barWidth = Math.max(2, (width - totalSpacing) / n);

    const sortedSet = new Set(currentStep.sortedIndices);
    const comparingSet = new Set(currentStep.comparingIndices);
    const swappingSet = new Set(currentStep.swappingIndices);
    const pivotIdx = currentStep.pivotIndex;

    const availableHeight = height - 32;

    for (let i = 0; i < n; i++) {
      const val = arr[i];
      const barHeight = Math.max(6, (val / (maxValue || 1)) * availableHeight);
      const x = i * (barWidth + barSpacing);
      const y = height - barHeight - 4;

      // Color selection
      let fillColor = '#0284c7'; // Default cyan-600
      let strokeColor = '#38bdf8'; // Border cyan-400
      let shadowGlow = 'rgba(56, 189, 248, 0.2)';

      if (sortedSet.has(i)) {
        fillColor = '#059669'; // Emerald-600
        strokeColor = '#34d399';
        shadowGlow = 'rgba(52, 211, 153, 0.4)';
      } else if (swappingSet.has(i)) {
        fillColor = '#e11d48'; // Rose-600
        strokeColor = '#fb7185';
        shadowGlow = 'rgba(251, 113, 133, 0.5)';
      } else if (comparingSet.has(i)) {
        fillColor = '#d97706'; // Amber-600
        strokeColor = '#fbbf24';
        shadowGlow = 'rgba(251, 191, 36, 0.5)';
      } else if (i === pivotIdx) {
        fillColor = '#9333ea'; // Purple-600
        strokeColor = '#c084fc';
        shadowGlow = 'rgba(192, 132, 252, 0.5)';
      }

      ctx.save();
      ctx.shadowColor = shadowGlow;
      ctx.shadowBlur = 8;

      // Draw rounded bar
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      const radius = Math.min(barWidth / 2, 4);

      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();

      // Bar border top accent
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // Draw numerical value if bars are wide enough
      if (barWidth >= 16) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String(val), x + barWidth / 2, height - 8);
      }
    }
  }, [currentStep, maxValue]);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 shadow-2xl overflow-hidden flex flex-col justify-end">
      {/* Legend overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-sky-500 shadow-sm shadow-sky-500/50" />
          <span className="text-slate-300">Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-400 shadow-sm shadow-amber-400/50" />
          <span className="text-amber-200">Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span className="text-rose-200">Swapping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-purple-500 shadow-sm shadow-purple-500/50" />
          <span className="text-purple-200">Pivot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          <span className="text-emerald-200">Sorted</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
