import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCrmCompany, updateCrmCompany, getCrmActivities, createCrmActivity, updateCrmActivity, deleteCrmActivity } from '../../../../services/salesService';
import { CalendarIcon, UserIcon } from '@heroicons/react/20/solid';

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityForm, setActivityForm] = useState({ type: 'task', title: '', description: '', due_date: '', status: 'open', contact_id: '' });
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'activities', name: 'Activities', icon: CalendarIcon }
  ];

  useEffect(() => {
    getCrmCompany(id).then(({ data }) => setCompany(data));
  }, [id]);

  const loadActivities = async () => {
    if (!id) return;
    const { data } = await getCrmActivities(id);
    setActivities((data || []).filter(a => a.company_id === id));
  };

  useEffect(() => { loadActivities(); }, [id]);

  const openActivityModal = (activity) => {
    setEditingActivity(activity);
    setActivityForm(activity ? {
      type: activity.type || 'task',
      title: activity.title || '',
      description: activity.description || '',
      due_date: activity.due_date ? activity.due_date.slice(0, 16) : '',
      status: activity.status || 'open',
      contact_id: activity.contact_id || ''
    } : { type: 'task', title: '', description: '', due_date: '', status: 'open', contact_id: '' });
    setShowActivityModal(true);
  };

  const closeActivityModal = () => { setShowActivityModal(false); setEditingActivity(null); };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    const payload = { ...activityForm, due_date: activityForm.due_date ? new Date(activityForm.due_date).toISOString() : null, company_id: id };
    if (editingActivity) await updateCrmActivity(editingActivity.id, payload);
    else await createCrmActivity(id, payload);
    closeActivityModal();
    loadActivities();
  };

  const handleActivityDelete = async (id) => {
    if (window.confirm('Delete this activity?')) {
      await deleteCrmActivity(id);
      loadActivities();
    }
  };

  if (!company) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">{company.name}</h2>
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>
      {activeTab === 'profile' && (
        <div>
          <div className="mb-2"><b>Industry:</b> {company.industry}</div>
          <div className="mb-2"><b>Size:</b> {company.size}</div>
          <div className="mb-2"><b>Website:</b> <a href={company.website} className="text-blue-600 underline">{company.website}</a></div>
          <div className="mb-2"><b>Phone:</b> {company.phone}</div>
          <div className="mb-2"><b>Address:</b> {company.address}</div>
          <Link to="/sales/crm/companies" className="text-purple-600 underline mt-4 inline-block">Back to Companies</Link>
        </div>
      )}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">Activities</h3>
            <button onClick={() => openActivityModal(null)} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Activity</button>
          </div>
          {activities.length === 0 ? (
            <div className="text-gray-500">No activities for this company.</div>
          ) : (
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(a => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{a.type}</td>
                    <td className="px-4 py-2">{a.title}</td>
                    <td className="px-4 py-2">{a.due_date ? a.due_date.slice(0, 10) : ''}</td>
                    <td className="px-4 py-2">{a.status}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => openActivityModal(a)} className="text-blue-600 hover:underline mr-2">Edit</button>
                      <button onClick={() => handleActivityDelete(a.id)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {showActivityModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <form onSubmit={handleActivitySubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="text-lg font-medium text-gray-900">{editingActivity ? 'Edit' : 'Add'} Activity</div>
                  <button type="button" onClick={closeActivityModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>
                <div className="space-y-3">
                  <select className="w-full px-3 py-2 border rounded" value={activityForm.type} onChange={e => setActivityForm(f => ({ ...f, type: e.target.value }))} required>
                    <option value="task">Task</option>
                    <option value="call">Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="reminder">Reminder</option>
                  </select>
                  <input className="w-full px-3 py-2 border rounded" placeholder="Title" value={activityForm.title} onChange={e => setActivityForm(f => ({ ...f, title: e.target.value }))} required />
                  <textarea className="w-full px-3 py-2 border rounded" placeholder="Description" value={activityForm.description} onChange={e => setActivityForm(f => ({ ...f, description: e.target.value }))} />
                  <input className="w-full px-3 py-2 border rounded" type="datetime-local" placeholder="Due Date" value={activityForm.due_date} onChange={e => setActivityForm(f => ({ ...f, due_date: e.target.value }))} />
                  <select className="w-full px-3 py-2 border rounded" value={activityForm.status} onChange={e => setActivityForm(f => ({ ...f, status: e.target.value }))} required>
                    <option value="open">Open</option>
                    <option value="done">Done</option>
                    <option value="snoozed">Snoozed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 mt-8">
                  <button type="button" onClick={closeActivityModal} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Save</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 