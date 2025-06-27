import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchPolicies, addPolicy, updatePolicy, deletePolicy, uploadPolicyFile } from '../../../services/policiesService';
import Card from '../../../components/common/layout/Card';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const initialForm = {
  name: '',
  category: '',
  description: '',
  version: '',
  last_updated: '',
  file: null,
  file_url: '',
  department: '',
  required_reading: false
};

const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openContent, setOpenContent] = useState({ intro: true, categories: false, compliance: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ add: true, edit: false, search: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Company Policies Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><BookOpenIcon className="w-5 h-5" /> Basics</button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><Cog6ToothIcon className="w-5 h-5" /> Platform How-To</button>
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><ChatBubbleLeftRightIcon className="w-5 h-5" /> AI</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (<>
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Overview</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Access and manage company policies, procedures, and guidelines for employees. Ensure everyone is up to date on the latest requirements.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('categories')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Categories</span>{openContent.categories ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.categories && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Organize policies by category (HR, Finance, Workplace, etc.)</li><li>Filter and search for quick access</li><li>Assign policies to departments as needed</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('compliance')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Compliance</span>{openContent.compliance ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.compliance && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Track required reading and policy acknowledgements</li><li>Keep records for audits and compliance</li><li>Update policies as regulations change</li></ul></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('add')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Adding Policies</span>{openPlatform.add ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.add && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Click "Add Policy" to upload new documents. Fill in all required fields and assign categories and departments as needed.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('edit')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Editing & Updating</span>{openPlatform.edit ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.edit && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Edit policy details, upload new versions, and update compliance requirements as needed.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('search')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Search & Filter</span>{openPlatform.search ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.search && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Use the search bar and category filter to quickly find policies. Filter by department or required reading status.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your policy assistant. I can help you manage, update, and answer questions about company policies.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I add a new policy?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Click the "Add Policy" button, fill in the required details, and upload the document. Assign categories and departments as needed.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I track required reading?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Mark policies as required reading. Employees can acknowledge and the system will track compliance for audits.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about policies..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

const CompanyPolicies = () => {
  const { currentOrganization } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const loadPolicies = () => {
    if (!currentOrganization) return;
    setLoading(true);
    fetchPolicies(currentOrganization.organization_id)
      .then(setPolicies)
      .catch(setError)
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadPolicies(); /* eslint-disable-next-line */ }, [currentOrganization]);

  const openModal = (policy = null) => {
    setEditingId(policy ? policy.id : null);
    setForm(policy ? {
      name: policy.name || '',
      category: policy.category || '',
      description: policy.description || '',
      version: policy.version || '',
      last_updated: policy.last_updated || '',
      file: null,
      file_url: policy.file_url || '',
      department: policy.department || '',
      required_reading: !!policy.required_reading
    } : initialForm);
    setModalOpen(true);
  };
  const openDeleteModal = (id) => { setDeleteId(id); setDeleteModalOpen(true); };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let file_url = form.file_url;
      if (form.file) {
        file_url = await uploadPolicyFile(form.file, currentOrganization.organization_id);
      }
      if (editingId) {
        await updatePolicy(editingId, { ...form, file_url });
      } else {
        await addPolicy({ ...form, file_url, organization_id: currentOrganization.organization_id });
      }
      setModalOpen(false);
      loadPolicies();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    setSaving(true);
    try {
      await deletePolicy(deleteId);
      setDeleteModalOpen(false);
      loadPolicies();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const categories = ['all', 'General', 'Finance', 'Workplace', 'Technology', 'HR', 'Communication'];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (size) => {
    return size;
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || policy.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (!currentOrganization) return <div>Select an organization</div>;
  if (loading) return <div>Loading policies...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Company Policies</h1>
          <p className="text-gray-600 text-sm mb-6">Access and manage company policies, procedures, and guidelines for employees.</p>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          style={{ boxShadow: '0 1px 4px 0 rgba(80,80,120,0.06)' }}
        >
          <InformationCircleIcon className="w-5 h-5 mr-2 text-purple-500" />
          Help
        </button>
      </div>
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      <div>
        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <button onClick={() => openModal()} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Add Policy</button>
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version & Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">No policies found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-purple-100 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{policy.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{policy.category}</div>
                      <div className="text-sm text-gray-500">{policy.department}</div>
                      {policy.requiredReading && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">v{policy.version}</div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(policy.lastUpdated)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{policy.fileType}</div>
                      <div className="text-sm text-gray-500">{formatFileSize(policy.fileSize)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openModal(policy)} className="text-purple-600 hover:text-purple-900">Edit</button>
                        <button onClick={() => openDeleteModal(policy.id)} className="text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900">{editingId ? 'Edit' : 'Add'} Policy</div>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 border rounded" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input className="w-full px-3 py-2 border rounded" placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              <textarea className="w-full px-3 py-2 border rounded" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Version" value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded" type="date" value={form.last_updated} onChange={e => setForm(f => ({ ...f, last_updated: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={form.required_reading} onChange={e => setForm(f => ({ ...f, required_reading: e.target.checked }))} />
                <span>Required Reading</span>
              </label>
              <input className="w-full px-3 py-2 border rounded" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              {form.file_url && <a href={form.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Current File</a>}
            </div>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
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
              <div className="text-lg font-medium text-gray-900">Delete Policy</div>
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <p>Are you sure you want to delete this policy?</p>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700">{saving ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPolicies; 