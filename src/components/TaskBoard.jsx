import React, { useState } from 'react';
import { Calendar, AlertCircle, Edit2, Trash2 } from 'lucide-react';

const TaskBoard = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  const columns = [
    {
      name: 'Pending',
      label: 'Backlog',
      accent: 'border-t-zinc-300 dark:border-t-zinc-600',
    },
    {
      name: 'In Progress',
      label: 'In Progress',
      accent: 'border-t-blue-500',
    },
    {
      name: 'Completed',
      label: 'Completed',
      accent: 'border-t-emerald-500',
    },
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnName) => {
    e.preventDefault();
    if (draggedOverColumn !== columnName) setDraggedOverColumn(columnName);
  };

  const handleDragLeave = () => setDraggedOverColumn(null);

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== targetStatus) {
      onStatusChange(task, targetStatus);
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-emerald-500';
      default: return 'bg-zinc-400';
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.name);
        const isOver = draggedOverColumn === col.name;

        return (
          <div
            key={col.name}
            onDragOver={(e) => handleDragOver(e, col.name)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.name)}
            className={`flex flex-col rounded-xl border-t-2 ${col.accent} border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 transition-all duration-200 min-h-[480px] ${
              isOver ? 'ring-2 ring-primary-500/30 bg-primary-50/30 dark:bg-primary-900/10' : ''
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {col.label}
              </h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                {colTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto max-h-[600px]">
              {colTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-600">
                  Drop tasks here
                </div>
              ) : (
                colTasks.map((task) => {
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

                  return (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className="group cursor-grab active:cursor-grabbing p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-sm transition-all duration-150"
                      id={`board-task-${task._id}`}
                    >
                      {/* Priority dot + actions */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityDot(task.priority)}`} />
                          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(task)}
                            className="p-1 rounded text-zinc-400 hover:text-primary-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition cursor-pointer"
                            id={`board-edit-${task._id}`}
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDelete(task._id)}
                            className="p-1 rounded text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition cursor-pointer"
                            id={`board-delete-${task._id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h5 className={`text-sm font-medium text-zinc-800 dark:text-zinc-100 leading-snug line-clamp-2 ${
                        task.status === 'Completed' ? 'line-through text-zinc-400 dark:text-zinc-600' : ''
                      }`}>
                        {task.title}
                      </h5>

                      {task.description && (
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-700/60 text-[10px] text-zinc-400 dark:text-zinc-500">
                        <span className={`flex items-center gap-1 ${isOverdue ? 'text-rose-500 font-semibold' : ''}`}>
                          <Calendar className="w-3 h-3" />
                          {formatDate(task.dueDate)}
                        </span>
                        {isOverdue && (
                          <span className="flex items-center gap-0.5 text-rose-500 font-semibold">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoard;
