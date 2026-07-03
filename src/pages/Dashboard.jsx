import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskStats from '../components/TaskStats';
import TaskCard from '../components/TaskCard';
import TaskBoard from '../components/TaskBoard';
import TaskForm from '../components/TaskForm';
import { Search, Plus, Kanban, List, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const { fetchWithAuth } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Views
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Debounced search / filter fetch
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Build query params
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (priorityFilter !== 'All') params.append('priority', priorityFilter);

      const res = await fetchWithAuth(`/tasks?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load tasks');
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Error fetching tasks.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, fetchWithAuth]);

  // Fetch on mount or filter change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, 300); // 300ms debounce on search input

    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, priorityFilter, fetchTasks]);

  // Handle task submission (add or update)
  const handleSubmitTask = async (taskData) => {
    try {
      setError('');
      if (editingTask) {
        // Edit Task
        const res = await fetchWithAuth(`/tasks/${editingTask._id}`, {
          method: 'PUT',
          body: JSON.stringify(taskData),
        });
        if (!res.ok) throw new Error('Failed to update task');
      } else {
        // Create Task
        const res = await fetchWithAuth('/tasks', {
          method: 'POST',
          body: JSON.stringify(taskData),
        });
        if (!res.ok) throw new Error('Failed to create task');
      }
      setIsFormOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Error saving task.');
    }
  };

  // Handle status toggle / inline drag-drop status updates
  const handleStatusChange = async (task, newStatus) => {
    try {
      // Trigger confetti if completed!
      if (newStatus === 'Completed') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#8b5cf6', '#a855f7', '#6d28d9', '#3b82f6', '#10b981'],
        });
      }

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );

      const res = await fetchWithAuth(`/tasks/${task._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }
      fetchTasks(); // Reload to sync with DB ordering
    } catch (err) {
      setError(err.message || 'Error updating status.');
      fetchTasks(); // Revert on failure
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      // Optimistic delete
      setTasks((prev) => prev.filter((t) => t._id !== taskId));

      const res = await fetchWithAuth(`/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
    } catch (err) {
      setError(err.message || 'Error deleting task.');
      fetchTasks(); // Sync backend state
    }
  };

  // Load sample/mock tasks for demonstration
  const handleLoadSampleTasks = async () => {
    setLoading(true);
    try {
      const sampleTasks = [
        {
          title: '🚀 Setup React and Tailwind CSS v4',
          description: 'Build client dashboard, login cards, and configure global stylesheet transitions.',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day from now
          priority: 'High',
          status: 'Completed',
        },
        {
          title: '🛡️ Configure JWT Auth Middleware',
          description: 'Implement secure routes, password hashing with bcrypt, and validation endpoints.',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
          priority: 'High',
          status: 'In Progress',
        },
        {
          title: '📋 Draft Database Schemas in Mongoose',
          description: 'Define User and Task relationships and database indexes for fast query resolution.',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'Medium',
          status: 'Pending',
        },
        {
          title: '🎨 Design Light/Dark Glassmorphism UI',
          description: 'Polish components, implement theme variables, add animations, and integrate canvas-confetti.',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'Low',
          status: 'Pending',
        },
      ];

      for (const t of sampleTasks) {
        await fetchWithAuth('/tasks', {
          method: 'POST',
          body: JSON.stringify(t),
        });
      }

      fetchTasks();
    } catch (err) {
      setError(err.message || 'Error seeding sample tasks.');
      setLoading(false);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen auth-bg transition-all duration-150 pb-16">
      <div className="w-full px-6 lg:px-8 pt-8">
        
        {/* Workspace Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Workspace</h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Manage and track your tasks and milestones.</p>
          </div>

          <div className="flex items-center space-x-3 sm:justify-end">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-700 text-primary-600 dark:text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
                }`}
                title="List View"
                id="list-view-btn"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'board'
                    ? 'bg-white dark:bg-zinc-700 text-primary-600 dark:text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
                }`}
                title="Kanban Board View"
                id="board-view-btn"
              >
                <Kanban className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchTasks}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Refresh Tasks"
              id="refresh-tasks-btn"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Add Task Button */}
            <button
              onClick={handleCreateClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition shadow-sm cursor-pointer"
              id="add-task-btn"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Task</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 font-medium flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-sm font-bold opacity-60 hover:opacity-100 cursor-pointer">Dismiss</button>
          </div>
        )}

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Main Content Pane (Col span 3) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Inline Compact Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all placeholder:text-zinc-405"
                  id="search-input"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 cursor-pointer"
                id="status-filter-select"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 cursor-pointer"
                id="priority-filter-select"
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* View Render */}
            {loading && tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-3" />
                <p className="text-zinc-400 dark:text-zinc-500 text-sm">Loading workspace...</p>
              </div>
            ) : tasks.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center p-8 md:p-12 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 border border-primary-100 dark:border-primary-900/20">
                  <Plus className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-800 dark:text-white">No tasks found</h4>
                <p className="text-zinc-400 dark:text-zinc-550 text-xs mt-1.5 max-w-xs mx-auto">
                  Try adjusting your filters, load samples, or add a new task to your sprint.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    onClick={handleCreateClick}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition shadow-sm cursor-pointer"
                    id="empty-add-task-btn"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Task</span>
                  </button>
                  <button
                    onClick={handleLoadSampleTasks}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold transition cursor-pointer"
                    id="seed-samples-btn"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Load Demo Tasks</span>
                  </button>
                </div>
              </div>
            ) : viewMode === 'list' ? (
              // List View
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              // Kanban Board View
              <TaskBoard
                tasks={tasks}
                onEdit={handleEditClick}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>

          {/* Statistics Sidebar Panel (Col span 1) */}
          <div className="lg:col-span-1">
            <TaskStats tasks={tasks} />
          </div>
        </div>

        {/* Add/Edit Modal */}
        <TaskForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleSubmitTask}
          task={editingTask}
        />

      </div>
    </div>
  );
};

export default Dashboard;
