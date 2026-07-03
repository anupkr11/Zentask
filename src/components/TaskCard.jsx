import React from 'react';
import { Calendar, Edit2, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPriorityChip = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/40';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40';
      default:
        return 'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Pending':
      default:
        return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className={`group relative p-5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
      task.status === 'Completed'
        ? 'glass dark:glass-dark border-zinc-100 dark:border-zinc-800/60 opacity-70 hover:opacity-100'
        : 'glass dark:glass-dark border-zinc-200 dark:border-zinc-800 shadow-sm'
    }`}>
      {/* Top Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3 min-w-0">
          {/* Checkbox */}
          <button
            onClick={() => onStatusChange(task, task.status === 'Completed' ? 'Pending' : 'Completed')}
            className={`mt-0.5 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded border transition-all cursor-pointer focus:outline-none ${
              task.status === 'Completed'
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-zinc-300 dark:border-zinc-600 hover:border-primary-500'
            }`}
          >
            {task.status === 'Completed' && (
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            )}
          </button>

          <div className="min-w-0">
            <h4 className={`text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-snug ${
              task.status === 'Completed' ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
            }`}>
              {task.title}
            </h4>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${getPriorityChip(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${getStatusChip(task.status)}`}>
                {task.status}
              </span>
              {isOverdue && (
                <span className="flex items-center text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800/40">
                  <AlertCircle className="w-2.5 h-2.5 mr-1" />
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-md text-zinc-400 hover:text-primary-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            title="Edit Task"
            id={`edit-task-${task._id}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-md text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all cursor-pointer"
            title="Delete Task"
            id={`delete-task-${task._id}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-3 ml-8 leading-relaxed line-clamp-2 ${
          task.status === 'Completed' ? 'text-zinc-400 dark:text-zinc-600' : ''
        }`}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-4 pt-3 ml-8 text-xs text-zinc-400 dark:text-zinc-500">
        <div className={`flex items-center space-x-1 ${isOverdue ? 'text-rose-500 font-semibold' : ''}`}>
          <Calendar className="w-3 h-3" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <span className="text-[10px] text-zinc-300 dark:text-zinc-600">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
