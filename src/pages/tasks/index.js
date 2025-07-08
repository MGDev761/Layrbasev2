import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon,
  TagIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { fetchTasks, fetchOrgAssignees, createTask, updateTask, deleteTask } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';

const STATUS_OPTIONS = [
  { value: 'To Do', label: 'To Do', color: 'bg-gray-100 text-gray-800', icon: ClockIcon },
  { value: 'In Progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: ExclamationCircleIcon },
  { value: 'Awaiting Review', label: 'Awaiting Review', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  { value: 'Done', label: 'Done', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
];

const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'Medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'High', label: 'High', color: 'bg-red-100 text-red-800' },
];

const MODULE_OPTIONS = ['HR', 'Finance', 'Marketing', 'Legal', 'Sales', 'Operations'];

const TaskCard = ({ task, assignees, onEdit, onDelete, onStatusChange }) => {
  const getAssigneeName = (assignedTo) => {
    if (!assignedTo) return 'Unassigned';
    const assignee = assignees.find(a => a.id === assignedTo);
    return assignee ? `${assignee.first_name} ${assignee.last_name}`.trim() : 'Unknown';
  };

  const getStatusConfig = (status) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  };

  const getPriorityConfig = (priority) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[1];
  };

  const getInitials = (assignedTo) => {
    if (!assignedTo) return '?';
    const assignee = assignees.find(a => a.id === assignedTo);
    if (!assignee) return '?';
    return `${assignee.first_name?.[0] || ''}${assignee.last_name?.[0] || ''}`.toUpperCase();
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done';

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{task.title}</h3>
            {task.description && (
              <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status & Priority */}
        <div className="flex items-center space-x-2 mb-3">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${getStatusConfig(task.status).color}`}
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          <span className={`text-xs font-medium rounded-full px-2 py-1 ${getPriorityConfig(task.priority).color}`}>
            {task.priority}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2">
          {/* Assignee */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">{getInitials(task.assigned_to)}</span>
            </div>
            <span className="text-xs text-gray-600">{getAssigneeName(task.assigned_to)}</span>
          </div>

          {/* Due Date */}
          {task.due_date && (
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
              <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                {new Date(task.due_date).toLocaleDateString()}
                {isOverdue && ' (Overdue)'}
              </span>
            </div>
          )}

          {/* Module */}
          {task.module && (
            <div className="flex items-center space-x-2">
              <TagIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-600">{task.module}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskModal = ({ isOpen, task, assignees, onClose, onSave }) => {
  const [form, setForm] = useState({
  title: '',
  description: '',
  priority: 'Medium',
  status: 'To Do',
  due_date: '',
  assigned_to: '',
  module: '',
    tags: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        status: task.status || 'To Do',
        due_date: task.due_date || '',
        assigned_to: task.assigned_to || '',
        module: task.module || '',
          tags: (task.tags || []).join(', ')
      });
    } else {
        setForm({
          title: '',
          description: '',
          priority: 'Medium',
          status: 'To Do',
          due_date: '',
          assigned_to: '',
          module: '',
          tags: ''
        });
      }
    }
  }, [isOpen, task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const taskData = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
        assigned_to: form.assigned_to || null,
      };
      await onSave(taskData);
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Add task description..."
              />
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({...form, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {PRIORITY_OPTIONS.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date & Assignee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({...form, due_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  value={form.assigned_to}
                  onChange={(e) => setForm({...form, assigned_to: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Unassigned</option>
                  {assignees.map(assignee => (
                    <option key={assignee.id} value={assignee.id}>
                      {`${assignee.first_name} ${assignee.last_name}`.trim()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Module & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module
                </label>
                <select
                  value={form.module}
                  onChange={(e) => setForm({...form, module: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Module</option>
                  {MODULE_OPTIONS.map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({...form, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : (task ? 'Update' : 'Create')} Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const KanbanBoard = ({ tasks, assignees, onEdit, onDelete, onStatusChange }) => {
  const getAssigneeName = (assignedTo) => {
    if (!assignedTo) return 'Unassigned';
    const assignee = assignees.find(a => a.id === assignedTo);
    return assignee ? `${assignee.first_name} ${assignee.last_name}`.trim() : 'Unknown';
  };

  const getPriorityConfig = (priority) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[1];
  };

  const getInitials = (assignedTo) => {
    if (!assignedTo) return '?';
    const assignee = assignees.find(a => a.id === assignedTo);
    if (!assignee) return '?';
    return `${assignee.first_name?.[0] || ''}${assignee.last_name?.[0] || ''}`.toUpperCase();
  };

  const tasksByStatus = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status.value] = tasks.filter(task => task.status === status.value);
    return acc;
  }, {});

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskData = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (taskData.status !== newStatus) {
      onStatusChange(taskData.id, newStatus);
    }
  };

  const KanbanCard = ({ task }) => {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done';

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        className="bg-white rounded-lg border border-gray-200 p-3 mb-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-move"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1">{task.title}</h4>
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        )}

        {/* Priority & Module */}
        <div className="flex items-center space-x-2 mb-3">
          <span className={`text-xs font-medium rounded-full px-2 py-1 ${getPriorityConfig(task.priority).color}`}>
            {task.priority}
          </span>
          {task.module && (
            <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1">
              {task.module}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Assignee */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">{getInitials(task.assigned_to)}</span>
            </div>
            <span className="text-xs text-gray-600 truncate max-w-20">{getAssigneeName(task.assigned_to)}</span>
          </div>

          {/* Due Date */}
          {task.due_date && (
            <div className="flex items-center space-x-1">
              <CalendarDaysIcon className="w-3 h-3 text-gray-400" />
              <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATUS_OPTIONS.map((status) => (
        <div
          key={status.value}
          className="bg-gray-50 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status.value)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <status.icon className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">{status.label}</h3>
            </div>
            <span className="bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
              {tasksByStatus[status.value].length}
            </span>
          </div>

          {/* Tasks */}
          <div className="space-y-2 min-h-[200px]">
            {tasksByStatus[status.value].length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No tasks
              </div>
            ) : (
              tasksByStatus[status.value].map(task => (
                <KanbanCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const Tasks = () => {
  const { currentOrganization, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, assigneesData] = await Promise.all([
        fetchTasks(currentOrganization.organization_id),
        fetchOrgAssignees(currentOrganization.organization_id)
      ]);
      
      setTasks(tasksData || []);
      setAssignees(assigneesData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentOrganization?.organization_id) {
      loadData();
    }
  }, [currentOrganization]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assigned_to === assigneeFilter;
    const matchesModule = moduleFilter === 'all' || task.module === moduleFilter;
    
    return matchesSearch && matchesStatus && matchesAssignee && matchesModule;
  });

  const handleSaveTask = async (taskData) => {
    const payload = {
      ...taskData,
      organization_id: currentOrganization.organization_id,
      created_by: user?.id
    };

    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await createTask(payload);
    }

    await loadData();
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    setDeleteTaskId(taskId);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(deleteTaskId);
      await loadData();
      setDeleteTaskId(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      await loadData();
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'Done').length;
    
    return { total, completed, inProgress, overdue };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600">Track and manage tasks across your organization</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ListBulletIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ExclamationCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
              <select
                value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="all">All Assignees</option>
              {assignees.map(assignee => (
                <option key={assignee.id} value={assignee.id}>
                  {`${assignee.first_name} ${assignee.last_name}`.trim()}
                </option>
                ))}
              </select>

            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="all">All Modules</option>
              {MODULE_OPTIONS.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-sm font-medium flex items-center space-x-1 ${
                  viewMode === 'cards' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="Kanban View"
              >
                <Squares2X2Icon className="w-4 h-4" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium flex items-center space-x-1 ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="List View"
              >
                <ListBulletIcon className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Display */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <ListBulletIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' || assigneeFilter !== 'all' || moduleFilter !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Get started by creating your first task'
            }
          </p>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Task
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <KanbanBoard
          tasks={filteredTasks}
          assignees={assignees}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map(task => {
                const assignee = assignees.find(a => a.id === task.assigned_to);
                const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done';
                
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            {assignee ? `${assignee.first_name?.[0] || ''}${assignee.last_name?.[0] || ''}`.toUpperCase() : '?'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {assignee ? `${assignee.first_name} ${assignee.last_name}`.trim() : 'Unassigned'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_OPTIONS.find(s => s.value === task.status)?.color || 'bg-gray-100 text-gray-800'}`}>
                        {task.status}
                      </span>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${PRIORITY_OPTIONS.find(p => p.value === task.priority)?.color || 'bg-yellow-100 text-yellow-800'}`}>
                        {task.priority}
                      </span>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                        {isOverdue && <div className="text-xs text-red-500">Overdue</div>}
                      </div>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                        </div>
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        assignees={assignees}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      {/* Delete Confirmation Modal */}
      {deleteTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteTaskId(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks; 