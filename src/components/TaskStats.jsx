import React from 'react';
import { CheckCircle2, Clock, Flame, ListTodo, Layers, HelpCircle } from 'lucide-react';

const TaskStats = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;

  const highPriority = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length;
  const medPriority = tasks.filter((t) => t.priority === 'Medium' && t.status !== 'Completed').length;
  const lowPriority = tasks.filter((t) => t.priority === 'Low' && t.status !== 'Completed').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Circular gauge config
  const radius = 36;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="p-5 rounded-xl border glass dark:glass-dark border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900/60">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center justify-between">
          <span>Workspace Health</span>
          <Layers className="w-4 h-4 text-zinc-400" />
        </h4>

        {/* Circular Progress Section */}
        <div className="flex items-center space-x-5 py-2">
          <div className="relative flex items-center justify-center flex-shrink-0">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="text-zinc-150 dark:text-zinc-800"
              />
              <circle
                stroke="#10b981" // emerald-500
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <span className="absolute text-sm font-bold text-zinc-800 dark:text-white">
              {completionRate}%
            </span>
          </div>
          <div className="min-w-0">
            <h5 className="text-xl font-bold text-zinc-800 dark:text-white leading-tight">
              {completed} of {total}
            </h5>
            <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-0.5 leading-snug">
              tasks completed in this sprint
            </p>
          </div>
        </div>

        {/* Status Breakdown List */}
        <div className="mt-5 space-y-3.5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* Backlog */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-zinc-650 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-zinc-350 dark:bg-zinc-500" />
              <span>Backlog</span>
            </div>
            <span className="font-bold text-zinc-700 dark:text-zinc-350 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md min-w-[20px] text-center">
              {pending}
            </span>
          </div>

          {/* In Progress */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-zinc-650 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>In Progress</span>
            </div>
            <span className="font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-md min-w-[20px] text-center">
              {inProgress}
            </span>
          </div>

          {/* Completed */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-zinc-650 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Completed</span>
            </div>
            <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md min-w-[20px] text-center">
              {completed}
            </span>
          </div>
        </div>
      </div>

      {/* Priority Backlog Card */}
      <div className="p-5 rounded-xl border glass dark:glass-dark border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900/60">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center justify-between">
          <span>Priority Backlog</span>
          <Flame className="w-4 h-4 text-rose-500" />
        </h4>
        <p className="text-xs text-zinc-450 dark:text-zinc-500 mb-4 leading-normal">
          Active, non-completed tasks awaiting attention:
        </p>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/20">
            <span className="block text-lg font-bold text-rose-600 dark:text-rose-400">{highPriority}</span>
            <span className="text-[10px] text-rose-450 dark:text-rose-500/80 uppercase font-semibold">High</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/15 border border-amber-100 dark:border-amber-900/20">
            <span className="block text-lg font-bold text-amber-600 dark:text-amber-400">{medPriority}</span>
            <span className="text-[10px] text-amber-450 dark:text-amber-500/80 uppercase font-semibold">Med</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/20">
            <span className="block text-lg font-bold text-emerald-600 dark:text-emerald-400">{lowPriority}</span>
            <span className="text-[10px] text-emerald-450 dark:text-emerald-500/80 uppercase font-semibold">Low</span>
          </div>
        </div>
      </div>

      {/* Quick Tips Box */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex items-start space-x-3">
        <HelpCircle className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
        <div className="text-[11px] text-zinc-555 dark:text-zinc-400 leading-relaxed">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Quick Tip:</span> Drag & drop cards between columns to change status, or double-click to view details.
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
