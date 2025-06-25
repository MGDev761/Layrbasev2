import React, { useState, useEffect, useRef } from 'react';
import { FolderIcon, DocumentTextIcon, MagnifyingGlassIcon, PlusIcon, ArrowUpTrayIcon, TrashIcon, EllipsisVerticalIcon, PencilSquareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { getContracts, getContractFolders, deleteContract, createContractFolder, createContract, uploadContractPDF, debugRls, deleteContractFile, duplicateContract, updateContract } from '../../../services/legalService';
import { useAuth } from '../../../contexts/AuthContext';

const DropdownMenu = ({ contract, onEdit, onDelete, onDuplicate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={e => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="inline-flex items-center justify-center w-8 h-8 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:ring-2 hover:ring-purple-400"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(contract); setIsOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              <PencilSquareIcon className="w-4 h-4 mr-3" />
              Move to Folder
            </a>
            {contract.pdf_file_path && (
              <a
                href={contract.pdf_file_path}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => { e.stopPropagation(); setIsOpen(false); }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <ArrowUpTrayIcon className="w-4 h-4 mr-3" />
                Download PDF
              </a>
            )}
            <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(contract); setIsOpen(false); }} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">
              <TrashIcon className="w-4 h-4 mr-3" />
              Delete
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const MoveToFolderModal = ({ show, onClose, onSave, folders, saving }) => {
  const [selectedFolderId, setSelectedFolderId] = useState('');

  useEffect(() => {
    if (show) {
      setSelectedFolderId('');
    }
  }, [show]);

  const handleSave = () => {
    onSave(selectedFolderId || null);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Move Contract to Folder</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select a new folder</label>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- None (Remove from folder) --</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200" disabled={saving}>
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadModal = ({ showModal, onClose, folders, onUpload, saving }) => {
  const [uploadData, setUploadData] = useState({ name: '', description: '', folderId: '', file: null });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadData({ ...uploadData, file });
    } else {
      alert('Please select a PDF file');
      e.target.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(uploadData);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative max-w-xl w-full bg-white rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="text-lg font-medium text-gray-900">Upload Contract</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center">
          <div className="flex-1 px-6 py-8 flex flex-col justify-center">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Name *</label>
              <input
                type="text"
                value={uploadData.name}
                onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Folder (Optional)</label>
              <select
                value={uploadData.folderId}
                onChange={(e) => setUploadData({ ...uploadData, folderId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <option value="">Select a folder</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">PDF File *</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Uploading...' : 'Upload Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FolderModal = ({ showModal, onClose, onCreate, saving }) => {
  const [newFolder, setNewFolder] = useState({ name: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newFolder);
  };
  
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative max-w-xl w-full bg-white rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="text-lg font-medium text-gray-900">Create New Folder</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center">
          <div className="flex-1 px-6 py-8 flex flex-col justify-center">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name *</label>
              <input
                type="text"
                value={newFolder.name}
                onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                placeholder="Enter folder name"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newFolder.description}
                onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                placeholder="Enter folder description (optional)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ContractViewer = ({ contract, onClose }) => {
  if (!contract) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{contract.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded">Back</button>
        </div>
        <div className="flex-1 overflow-auto flex flex-col items-center justify-center">
          {contract.pdf_file_path ? (
            <iframe
              src={contract.pdf_file_path}
              title="Contract PDF"
              className="w-full h-full min-h-[60vh] border-none"
            />
          ) : (
            <div className="text-center text-gray-500 py-10">No PDF uploaded for this contract.</div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end">
          {contract.pdf_file_path && (
            <a
              href={contract.pdf_file_path}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const { currentOrganization } = useAuth();
  const [showMoveToFolderModal, setShowMoveToFolderModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [viewerContract, setViewerContract] = useState(null);

  useEffect(() => {
    if (currentOrganization) {
      loadContracts();
      loadFolders();
    }
  }, [currentOrganization]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      if (!currentOrganization) return;
      const data = await getContracts(currentOrganization.organization_id);
      setContracts(data);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      if (!currentOrganization) return;
      const data = await getContractFolders(currentOrganization.organization_id);
      setFolders(data);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const handleDeleteContract = async (contract) => {
    if (!contract || !contract.id) return;
    if (window.confirm(`Are you sure you want to delete the contract "${contract.name}"?`)) {
      try {
        if (contract.pdf_file_path) {
          await deleteContractFile(contract.pdf_file_path);
        }
        await deleteContract(contract.id);
        await loadContracts();
        alert('Contract deleted successfully.');
      } catch (error) {
        console.error('Error deleting contract:', error);
        alert('Error deleting contract. Please check the console for details.');
      }
    }
  };

  const handleDuplicateContract = async (contract) => {
    if (!contract || !contract.id) return;
    if (window.confirm(`Are you sure you want to duplicate the contract "${contract.name}"?`)) {
      try {
        await duplicateContract(contract.id);
        await loadContracts();
        alert('Contract duplicated successfully.');
      } catch (error) {
        console.error('Error duplicating contract:', error);
        alert('Error duplicating contract. Please check the console for details.');
      }
    }
  };

  const handleShowMoveToFolderModal = (contract) => {
    setSelectedContract(contract);
    setShowMoveToFolderModal(true);
  };

  const handleMoveContract = async (newFolderId) => {
    if (!selectedContract) return;

    setSaving(true);
    try {
      await updateContract(selectedContract.id, { folder_id: newFolderId });
      await loadContracts();
      setShowMoveToFolderModal(false);
      setSelectedContract(null);
    } catch (error) {
      console.error("Error moving contract:", error);
      alert("Failed to move contract. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadContract = async (uploadData) => {
    if (!uploadData.name || !uploadData.file) {
      alert('Please fill in the contract name and select a file');
      return;
    }

    setSaving(true);
    try {
      if (!currentOrganization || !currentOrganization.organization_id) {
        throw new Error("No organization selected.");
      }

      const contractRecord = {
        name: uploadData.name,
        description: uploadData.description,
        folder_id: uploadData.folderId || null,
      };

      const newContract = await createContract(contractRecord, currentOrganization.organization_id);
      
      if (!newContract || !newContract.id) {
        throw new Error("Failed to create contract record or get an ID back.");
      }

      await uploadContractPDF(uploadData.file, newContract.id, currentOrganization.organization_id);
      
      setShowUploadModal(false);
      await loadContracts();
      alert('Contract uploaded successfully!');
    } catch (error) {
      console.error('Error uploading contract:', error);
      alert(`Error uploading contract: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFolder = async (newFolder) => {
    setSaving(true);
    try {
      await createContractFolder(newFolder, currentOrganization.organization_id);
      await loadFolders();
      setShowFolderModal(false);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
    setSaving(false);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Contracts</h1>
        <p className="text-gray-600 text-sm mb-6">Upload, organize, and manage your company's legal contracts. Click a contract to view or download its PDF.</p>
      </div>
      <div className="flex h-full">
        <div className="w-64 bg-gray-50 py-4 pr-6">
          <h2 className="text-lg font-semibold mb-4">Folders</h2>
          <ul className="space-y-1">
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setSelectedFolder('all'); }} className={`block px-3 py-2 rounded-md text-sm font-medium ${selectedFolder === 'all' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                All Contracts
              </a>
            </li>
            {folders.map(folder => (
              <li key={folder.id}>
                <a href="#" onClick={(e) => { e.preventDefault(); setSelectedFolder(folder.id); }} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${selectedFolder === folder.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <FolderIcon className="h-5 w-5 mr-2" />
                  {folder.name}
                </a>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setShowFolderModal(true)} 
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Create Folder
          </button>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-xs">
              <MagnifyingGlassIcon className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
              <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
              Upload Contract
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading contracts...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts
                  .filter(contract => selectedFolder === 'all' || contract.folder_id === selectedFolder)
                  .filter(contract => searchTerm === '' || contract.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(contract => (
                  <tr key={contract.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => setViewerContract(contract)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(contract.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu
                        contract={contract}
                        onDelete={handleDeleteContract}
                        onEdit={handleShowMoveToFolderModal}
                        onDuplicate={handleDuplicateContract}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <UploadModal 
        showModal={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        folders={folders}
        onUpload={handleUploadContract}
        saving={saving}
      />
      <FolderModal
        showModal={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onCreate={handleCreateFolder}
        saving={saving}
      />
      <MoveToFolderModal 
        show={showMoveToFolderModal}
        onClose={() => setShowMoveToFolderModal(false)}
        onSave={handleMoveContract}
        folders={folders}
        saving={saving}
      />
      <ContractViewer contract={viewerContract} onClose={() => setViewerContract(null)} />
    </div>
  );
};

export default Contracts;
