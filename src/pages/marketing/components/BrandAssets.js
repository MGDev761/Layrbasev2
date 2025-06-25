// Upload Asset Modal
{showUploadModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowUploadModal(false)} />
    <div className="relative max-w-xl w-full bg-white rounded-xl shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h3 className="text-lg font-medium text-gray-900">Upload Asset</h3>
        <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      <form onSubmit={e => { e.preventDefault(); handleUploadAsset(); }} className="flex-1 flex flex-col justify-center">
        <div className="flex-1 px-6 py-8 flex flex-col justify-center">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
            <input
              type="text"
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              placeholder="Enter asset name"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newAsset.description}
              onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={newAsset.asset_type}
              onChange={(e) => setNewAsset({ ...newAsset, asset_type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              {assetTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
            <input
              type="file"
              onChange={e => setSelectedFile(e.target.files[0])}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={() => setShowUploadModal(false)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !selectedFile || !newAsset.name}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Uploading...' : 'Upload Asset'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

// Upload Logo Modal
{showLogoUpload && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowLogoUpload(false)} />
    <div className="relative max-w-xl w-full bg-white rounded-xl shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h3 className="text-lg font-medium text-gray-900">Upload Logo</h3>
        <button onClick={() => setShowLogoUpload(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      <form onSubmit={e => { e.preventDefault(); handleUploadLogo(); }} className="flex-1 flex flex-col justify-center">
        <div className="flex-1 px-6 py-8 flex flex-col justify-center">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo File</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setLogoFile(e.target.files[0])}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={() => setShowLogoUpload(false)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !logoFile}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Uploading...' : 'Upload Logo'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

// Edit Brand Information Modal
{showEditModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowEditModal(false)} />
    <div className="relative max-w-xl w-full bg-white rounded-xl shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h3 className="text-lg font-medium text-gray-900">Edit Logo and Tagline</h3>
        <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      <form onSubmit={async e => { e.preventDefault(); const updatedBrandInfo = { ...brandInfo, ...editDraft }; setBrandInfo(updatedBrandInfo); setShowEditModal(false); try { setSaving(true); await upsertBrandInformation(updatedBrandInfo, currentOrganization.organization_id); alert('Brand information saved successfully!'); } catch (error) { console.error('Error saving brand information:', error); alert('Failed to save brand information. Please try again.'); } finally { setSaving(false); } }} className="flex-1 flex flex-col justify-center">
        <div className="flex-1 px-6 py-8 flex flex-col justify-center space-y-4">
          {/* Logo upload */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Logo</label>
            <div className="flex items-center gap-4">
              {editDraft.logo_url ? (
                <img src={editDraft.logo_url} alt="Logo Preview" className="w-16 h-16 object-contain bg-gray-100 border border-gray-200 rounded-md" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-gray-300">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tagline</label>
            <input
              type="text"
              value={editDraft.tagline}
              onChange={e => setEditDraft(d => ({ ...d, tagline: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              placeholder="Enter tagline"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Brand Blurb</label>
            <textarea
              value={editDraft.brand_blurb}
              onChange={e => setEditDraft(d => ({ ...d, brand_blurb: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              placeholder="Enter brand blurb"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={saving}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)} 