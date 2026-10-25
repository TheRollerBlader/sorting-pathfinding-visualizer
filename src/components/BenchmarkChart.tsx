import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface BenchmarkItem {
  name: string;
  timeMs: number;
  operations: number;
  comparisons?: number;
  cost?: number;
  color?: string;
}

interface BenchmarkChartProps {
  title: string;
  subtitle?: string;
  data: BenchmarkItem[];
  metricType: 'sorting' | 'pathfinding';
}

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({
  title,
  subtitle,
  data,
  metricType,
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <span>{title}</span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              Benchmark Telemetry
            </span>
          </h4>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#38bdf8"
              tick={{ fill: '#38bdf8', fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#a855f7"
              tick={{ fill: '#a855f7', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
            />

            {/* Bars */}
            <Bar
              yAxisId="left"
              dataKey="timeMs"
              name="Execution Time (ms)"
              fill="#38bdf8"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="operations"
              name={metricType === 'sorting' ? 'Swaps / Writes' : 'Nodes Visited'}
              fill="#a855f7"
              radius={[6, 6, 0, 0]}
            />
            {metricType === 'sorting' && (
              <Bar
                yAxisId="right"
                dataKey="comparisons"
                name="Comparisons"
                fill="#f59e0b"
                radius={[6, 6, 0, 0]}
              />
            )}
            {metricType === 'pathfinding' && (
              <Bar
                yAxisId="right"
                dataKey="cost"
                name="Path Cost"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
