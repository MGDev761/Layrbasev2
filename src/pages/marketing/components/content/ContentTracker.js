import React, { useState } from 'react';
import Modal from '../../../../components/common/layout/Modal';

const MOCK_CONTENT = [
  {
    id: 1,
    title: 'AI in TV Planning',
    type: 'Blog',
    channel: 'Website',
    status: 'Draft',
    owner: 'Sam',
    publishDate: '2025-07-10',
    tags: ['Thought Leadership'],
  },
  {
    id: 2,
    title: 'New Feature Video',
    type: 'Video',
    channel: 'LinkedIn',
    status: 'Scheduled',
    owner: 'Jess',
    publishDate: '2025-07-12',
    tags: ['Product Update'],
  },
  {
    id: 3,
    title: 'Funding Announce',
    type: 'Email',
    channel: 'Email/PR',
    status: 'In Review',
    owner: 'Mark',
    publishDate: '2025-07-20',
    tags: ['Investor Comms'],
  },
];

const TYPES = ['Blog', 'Video', 'Email', 'Social', 'Webinar'];
const STATUSES = ['Idea', 'Draft', 'In Review', 'Scheduled', 'Published', 'Archived'];
const OWNERS = ['Sam', 'Jess', 'Mark'];

const ContentTracker = () => {
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = MOCK_CONTENT.filter(item =>
    (!typeFilter || item.type === typeFilter) &&
    (!statusFilter || item.status === statusFilter) &&
    (!ownerFilter || item.owner === ownerFilter) &&
    (!search || item.title.toLowerCase().includes(search.toLowerCase()) || (item.tags && item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))))
  );

  return (
    <div className="">
      {/* Heading Row */}
      <div className="flex items-center justify-between mb-2 mt-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Content Tracker</h1>
          <p className="text-gray-600 text-sm mb-2">Plan, track, and manage all your content across channels in one place.</p>
        </div>
        {/* Optionally add a help button here if needed */}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 rounded-t-md px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search content..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-b-2 border-transparent focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-2 py-1 border-b-2 border-transparent focus:outline-none focus:border-purple-500 text-sm">
              <option value="">All Types</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-2 py-1 border-b-2 border-transparent focus:outline-none focus:border-purple-500 text-sm">
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} className="px-2 py-1 border-b-2 border-transparent focus:outline-none focus:border-purple-500 text-sm">
              <option value="">All Owners</option>
              {OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700" onClick={() => setSelected({})}>
          + Add Content
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-b-md overflow-visible">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publish Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No content found.</p>
                  </div>
                </td>
              </tr>
            ) : filtered.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 cursor-pointer" onClick={() => setSelected(item)}>{item.title}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.channel}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.status}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.owner}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.publishDate}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {item.tags.map(tag => <span key={tag} className="inline-block bg-purple-100 text-purple-700 rounded px-2 py-0.5 text-xs mr-1">{tag}</span>)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:underline text-xs" onClick={() => setSelected(item)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Detail Modal (mock) */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
          <div className="p-6 max-w-lg">
            <h2 className="text-lg font-bold mb-2">{selected.title || 'Add Content'}</h2>
            <div className="text-sm text-gray-600 mb-4">(Detail view coming soon)</div>
            <button className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm" onClick={() => setSelected(null)}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContentTracker; 