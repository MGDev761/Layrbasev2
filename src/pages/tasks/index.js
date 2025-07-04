import React, { useState, useEffect } from 'react';
import { fetchTasks, fetchOrgAssignees, createTask, updateTask, deleteTask } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'To Do' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Awaiting Review', value: 'Awaiting Review' },
  { label: 'Done', value: 'Done' },
];

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const STATUS_OPTIONS = ['To Do', 'In Progress', 'Awaiting Review', 'Done'];
const MODULE_OPTIONS = ['HR', 'Finance', 'Marketing', 'Legal', 'Sales'];

const initialForm = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'To Do',
  due_date: '',
  assigned_to: '',
  module: '',
  tags: '',
};

const Tasks = () => {
  const { currentOrganization, user } = useAuth();
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!currentOrganization?.organization_id) {
      setTasks([]);
      setAssignees([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchTasks(currentOrganization.organization_id)
      .then(setTasks)
      .catch(setError)
      .finally(() => setLoading(false));
    fetchOrgAssignees(currentOrganization.organization_id)
      .then(setAssignees)
      .catch(() => {});
  }, [currentOrganization]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title?.toLowerCase().includes(search.toLowerCase()) ||
      ((task.assignee?.first_name + ' ' + (task.assignee?.last_name || '')).toLowerCase().includes(search.toLowerCase())) ||
      task.module?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (task = null) => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        status: task.status || 'To Do',
        due_date: task.due_date || '',
        assigned_to: task.assigned_to || '',
        module: task.module || '',
        tags: (task.tags || []).join(', '),
      });
      setEditingId(task.id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleEdit = (task) => handleOpenModal(task);
  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    setSaving(true);
    try {
      await deleteTask(deleteId);
      setDeleteModalOpen(false);
      setDeleteId(null);
      setLoading(true);
      fetchTasks(currentOrganization.organization_id).then(setTasks).catch(setError).finally(() => setLoading(false));
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
        assigned_to: form.assigned_to || null,
        organization_id: currentOrganization.organization_id,
      };
      if (!editingId && user?.id) {
        payload.created_by = user.id;
      }
      if (editingId) {
        await updateTask(editingId, payload);
      } else {
        await createTask(payload);
      }
      setModalOpen(false);
      setForm(initialForm);
      setEditingId(null);
      setLoading(true);
      fetchTasks(currentOrganization.organization_id).then(setTasks).catch(setError).finally(() => setLoading(false));
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 mt-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 text-sm mb-2">Track, assign, and manage tasks across your business modules.</p>
        </div>
      </div>
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setView('board')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                view === 'board'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Board View
            </button>
            <button
              onClick={() => setView('list')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                view === 'list'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              List View
            </button>
          </nav>
        </div>
      </div>
      {view === 'list' && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 rounded-t-md px-4 pt-4 pb-2 border-b border-gray-200">
          {/* Left: Search bar only */}
          <div className="relative flex-1 max-w-md">
            <svg className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-b-2 border-transparent focus:outline-none focus:border-purple-500"
            />
          </div>
          {/* Right: Dropdown and button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none px-6 py-2 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 pr-8 text-base"
              >
                {STATUS_FILTERS.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-500">
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              + New Task
            </button>
          </div>
        </div>
      )}
      <div>
        {view === 'board' ? (
          <div className="text-gray-500">[Kanban Board Placeholder]</div>
        ) : loading ? (
          <div className="py-12 text-center text-gray-400">Loading tasks...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">Error loading tasks: {error.message}</div>
        ) : (
          <div className="bg-white rounded-md overflow-visible">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked Module</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No tasks found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{task.assignee ? `${task.assignee.first_name || ''} ${task.assignee.last_name || ''}`.trim() : <span className="text-gray-400">Unassigned</span>}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{task.due_date || '-'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'Done' ? 'bg-green-100 text-green-800' : task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : task.status === 'Awaiting Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{task.status}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{task.module}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.priority === 'High' ? 'bg-red-100 text-red-800' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{task.priority}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-purple-600 hover:text-purple-900" onClick={e => { e.stopPropagation(); handleEdit(task); }}>Edit</button>
                          <button className="text-red-500 hover:text-red-700" onClick={e => { e.stopPropagation(); handleDelete(task.id); }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal for New/Edit Task */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900">{editingId ? 'Edit Task' : 'New Task'}</div>
              <button type="button" onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 border rounded" name="title" placeholder="Title" value={form.title} onChange={handleFormChange} required />
              <textarea className="w-full px-3 py-2 border rounded" name="description" placeholder="Description" value={form.description} onChange={handleFormChange} />
              <div className="flex gap-2">
                <select className="w-1/2 px-3 py-2 border rounded" name="priority" value={form.priority} onChange={handleFormChange}>
                  {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <select className="w-1/2 px-3 py-2 border rounded" name="status" value={form.status} onChange={handleFormChange}>
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <input className="w-full px-3 py-2 border rounded" name="due_date" type="date" value={form.due_date} onChange={handleFormChange} />
              {/* Debug log for assignees */}
              {console.log('Assignees for dropdown:', assignees)}
              <select className="w-full px-3 py-2 border rounded" name="assigned_to" value={form.assigned_to} onChange={handleFormChange}>
                <option value="">Unassigned</option>
                {assignees.map(u => (
                  <option key={u.id} value={u.id}>{`${u.first_name || ''} ${u.last_name || ''}`.trim()}</option>
                ))}
              </select>
              <select className="w-full px-3 py-2 border rounded" name="module" value={form.module} onChange={handleFormChange}>
                <option value="">Select Module</option>
                {MODULE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <input className="w-full px-3 py-2 border rounded" name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleFormChange} />
            </div>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={handleCloseModal} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900">Delete Task</div>
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <p>Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700">{saving ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks; 