import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchPolicies, addPolicy, updatePolicy, deletePolicy, uploadPolicyFile } from '../../../services/policiesService';
import Card from '../../../components/common/layout/Card';

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
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Company Policies</h1>
        <p className="text-gray-600 text-sm mb-6">Access and manage company policies, procedures, and guidelines for employees.</p>
      </div>

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