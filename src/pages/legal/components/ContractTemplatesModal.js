import React, { useState, useEffect } from 'react';
import { createContract, getCompanyProfile } from '../../../services/legalService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const defaultSections = {
  'Standard NDA': [
    {
      title: 'Mutual Non-Disclosure Agreement (NDA)',
      content: `This Mutual Non-Disclosure Agreement (“Agreement”) is entered into as of [Date] between:

Party A: [Full Name / Company Name], with a principal place of business at [Address]
Party B: [Full Name / Company Name], with a principal place of business at [Address]

Collectively referred to as the “Parties”.

⸻

1. Purpose

The Parties intend to disclose certain confidential information to explore a potential business relationship. This Agreement governs the use and protection of that information.

⸻

2. Confidential Information

“Confidential Information” includes any non-public, proprietary, or sensitive information disclosed in any form (oral, written, electronic) by either Party that is:
  • marked or identified as confidential, or
  • would reasonably be considered confidential given its nature.

⸻

3. Obligations of the Parties

Each Party agrees to:
  • Keep Confidential Information confidential and use it only for the stated purpose.
  • Not disclose it to any third party without prior written consent.
  • Take reasonable steps to protect the information from unauthorised use or disclosure.

⸻

4. Exclusions

This Agreement does not apply to information that:
  • was already known without obligation of confidentiality,
  • is publicly available through no fault of the receiving party,
  • is lawfully received from a third party, or
  • is independently developed without reference to the confidential information.

⸻

5. Term

This Agreement remains in effect for 2 years from the date of disclosure, or until the Confidential Information no longer qualifies as confidential under this Agreement.

⸻

6. No License or Obligation

Nothing in this Agreement grants any license or rights to use the Confidential Information beyond the stated purpose. Neither Party is obligated to proceed with any business relationship.

⸻

7. Return or Destruction

Upon request, each Party will return or destroy any Confidential Information received.

⸻

8. Governing Law

This Agreement is governed by the laws of [Insert Jurisdiction, e.g. England and Wales].

⸻

9. Entire Agreement

This Agreement represents the entire understanding between the Parties and supersedes all prior discussions or agreements related to the subject.

⸻

Signatures

Party A: _________________________
Name:
Title:
Date:

Party B: _________________________
Name:
Title:
Date:
`
    }
  ],
  'Consulting Agreement': [
    { title: 'Services', content: 'Consultant will provide the following services...' },
    { title: 'Payment', content: 'Payment terms and schedule...' }
  ]
};

const ContractTemplatesModal = ({ open, onClose, organizationId, onContractCreated }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sections, setSections] = useState([]);
  const [editingSectionIdx, setEditingSectionIdx] = useState(null);
  const [newSection, setNewSection] = useState({ title: '', content: '' });
  const [contractDetails, setContractDetails] = useState({
    contractTitle: '',
    effectiveDate: '',
    parties: '',
    headerNote: '',
    logo: '',
    party1Blank: false,
    party1Name: '',
    party1Address: '',
    party2Blank: false,
    party2Name: '',
    party2Address: '',
    additionalClauses: ''
  });
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [category, setCategory] = useState('All');

  // Map templates to categories
  const templateCategories = {
    Foundation: ['Founder Agreement', 'Consulting Agreement'],
    Commercial: [],
    Confidentiality: ['Standard NDA'],
    Employment: []
  };
  const allCategories = ['All', ...Object.keys(templateCategories)];

  // Filter templates by selected category
  const filteredTemplates = category === 'All'
    ? templates
    : templates.filter(tpl => templateCategories[category]?.includes(tpl));

  useEffect(() => {
    // For now, just use defaultSections as templates
    setTemplates(Object.keys(defaultSections));
  }, []);

  useEffect(() => {
    if (step === 2 && selectedTemplate && sections.length === 0) {
      setSections(defaultSections[selectedTemplate] ? [...defaultSections[selectedTemplate]] : []);
    }
  }, [step, selectedTemplate]);

  useEffect(() => {
    if (step === 2 && organizationId) {
      (async () => {
        try {
          const profile = await getCompanyProfile(organizationId);
          setContractDetails(d => ({
            ...d,
            logo: d.logo || profile?.logo_url || '',
            party1Name: d.party1Name || profile?.name || '',
            party1Address: d.party1Address || profile?.registered_office || ''
          }));
        } catch (e) {
          // ignore
        }
      })();
    }
    // eslint-disable-next-line
  }, [step, organizationId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await createContract({
        name: contractDetails.contractTitle || selectedTemplate,
        description: JSON.stringify({
          parties: contractDetails.parties,
          effectiveDate: contractDetails.effectiveDate,
          headerNote: contractDetails.headerNote,
          sections
        }),
        version: '1.0',
        status: 'draft',
        last_updated: contractDetails.effectiveDate || new Date().toISOString().slice(0,10),
        organization_id: organizationId
      });
      setSaving(false);
      onClose();
      if (onContractCreated) onContractCreated();
    } catch (err) {
      setSaving(false);
      alert('Error saving contract');
    }
  };

  // Add this helper for pink highlight
  const highlight = (text) => `<span style='background: #fde8f3; border-radius: 3px; padding: 0 2px;'>${text}</span>`;

  // Replace Cancel button handlers to clear state
  const handleCancel = () => {
    setContractDetails({
      contractTitle: '',
      effectiveDate: '',
      parties: '',
      headerNote: '',
      logo: '',
      party1Blank: false,
      party1Name: '',
      party1Address: '',
      party2Blank: false,
      party2Name: '',
      party2Address: '',
      additionalClauses: ''
    });
    setStep(1);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex border border-gray-200 overflow-hidden relative" onClick={e => e.stopPropagation()}>
        {/* Sidebar Stepper */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col py-8 px-6 relative">
          <div className="text-lg font-bold text-gray-900 mb-8">Create a Contract from Template</div>
          <div className="flex flex-col gap-6">
            {[1,2,3].map(n => (
              <div key={n} className={`flex items-center gap-3 ${step === n ? '' : 'opacity-60'}`}> 
                <div className={`w-8 h-8 min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] rounded-full flex items-center justify-center font-bold ${step === n ? 'bg-purple-600 text-white' : 'bg-gray-300 text-white'}`}>{n}</div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {n === 1 ? 'Select Template' : n === 2 ? 'Enter Contract Details' : 'Preview & Save'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {n === 1 ? 'Choose a base contract' : n === 2 ? 'Upload a logo, enter party details, and add any extra clauses or terms.' : 'Review your contract document below.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-10 overflow-y-auto">
          {step === 1 && (
            <>
              <div className="mb-8 flex-1 overflow-y-auto">
                <div className="text-lg font-semibold text-gray-900 mb-2">Step 1: Select a Template</div>
                <div className="text-gray-600 mb-6">Choose a starting point for your contract. You can customize everything later.</div>
                {/* Category toggle */}
                <div className="flex gap-2 mb-6">
                  {allCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={`px-4 py-1 rounded-full border text-sm font-medium transition ${category === cat ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50'}`}
                      onClick={() => setCategory(cat)}
                    >{cat}</button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTemplates.map((tpl) => (
                    <button type="button" key={tpl}
                      onClick={() => setSelectedTemplate(tpl)}
                      className={`flex items-center gap-4 p-6 bg-white border rounded-lg shadow transition group ${selectedTemplate === tpl ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-500'}`}>
                      <div className="w-14 h-14 bg-purple-100 rounded flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900 group-hover:text-purple-700">{tpl}</div>
                        <div className="text-xs text-gray-500 mt-1">Template for {tpl}</div>
                      </div>
                    </button>
                  ))}
                  {filteredTemplates.length === 0 && (
                    <div className="col-span-2 text-gray-400 text-center py-8">No templates in this category yet.</div>
                  )}
                </div>
              </div>
              <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-10 flex justify-end z-20">
                <button
                  type="button"
                  className="mr-auto text-purple-700 hover:underline text-sm font-medium focus:outline-none"
                  onClick={handleCancel}
                >Cancel</button>
                <button
                  type="button"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium disabled:opacity-50"
                  disabled={!selectedTemplate}
                  onClick={() => setStep(2)}
                >Next</button>
              </div>
            </>
          )}
          {step === 2 && (
            <form className="flex flex-col overflow-y-auto w-full max-w-2xl mx-auto" onSubmit={e => { e.preventDefault(); setStep(3); }} style={{ justifyContent: 'flex-start' }}>
              <div className="space-y-4 w-full">
                <div className="text-lg font-semibold text-gray-900 mb-2">Step 2: Enter Contract Details</div>
                {/* Logo upload or preview */}
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 w-40">Logomark (optional)</label>
                  <div className="flex items-center flex-1">
                    {contractDetails.logo ? (
                      <div className="relative group w-20 h-20">
                        <img src={contractDetails.logo} alt="Logo preview" className="w-20 h-20 object-contain rounded" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition cursor-pointer rounded">
                          <button
                            type="button"
                            className="opacity-0 group-hover:opacity-100 transition bg-white bg-opacity-80 rounded-full p-1 mx-1"
                            style={{ pointerEvents: 'auto' }}
                            onClick={() => { document.getElementById('logo-upload').click(); }}
                            tabIndex={-1}
                          >
                            <PencilIcon className="w-4 h-4 text-gray-700" />
                          </button>
                          <button
                            type="button"
                            className="opacity-0 group-hover:opacity-100 transition bg-white bg-opacity-80 rounded-full p-1 mx-1"
                            style={{ pointerEvents: 'auto' }}
                            onClick={() => setContractDetails(d => ({ ...d, logo: '' }))}
                            tabIndex={-1}
                          >
                            <TrashIcon className="w-4 h-4 text-red-600" />
                          </button>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = ev => setContractDetails(d => ({ ...d, logo: ev.target.result }));
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="relative flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-2xl bg-white transition-colors duration-200 cursor-pointer hover:border-purple-500 min-h-[120px] w-full"
                        onClick={() => document.getElementById('logo-upload').click()}
                      >
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = ev => setContractDetails(d => ({ ...d, logo: ev.target.result }));
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center pointer-events-none select-none">
                          <div className="mb-2">
                            <svg width="40" height="40" fill="none" viewBox="0 0 56 56">
                              <rect width="40" height="40" rx="12" fill="#F3E8FF"/>
                              <path d="M20 28V18" stroke="#A21CAF" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M16 22l4-4 4 4" stroke="#A21CAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="text-gray-500 text-xs">
                            Drop your logo here, <span className="text-purple-600 underline cursor-pointer">or click to browse</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Divider and Date */}
                <hr className="my-4" />
                <div className="flex items-center mb-2">
                  <div className="w-40">
                    <label className="block text-sm font-medium text-gray-700">Contract Date</label>
                    <p className="text-xs text-gray-500 mt-1">The effective date of this contract</p>
                  </div>
                  <div className="flex-1">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded text-sm"
                      value={contractDetails.effectiveDate || ''}
                      onChange={e => setContractDetails(d => ({ ...d, effectiveDate: e.target.value }))}
                    />
                  </div>
                </div>
                {/* Divider between date and parties */}
                <hr className="my-4" />
                {/* Parties on separate rows */}
                {[0, 1].map(i => (
                  <div key={i} className="flex items-center mb-4 border-b pb-4">
                    <div className="w-40">
                      <label className="block text-sm font-medium text-gray-700">Party {i + 1}</label>
                      <p className="text-xs text-gray-500 mt-1">Name and address of {i === 0 ? 'first' : 'second'} party</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <label className="flex items-center gap-1 text-xs text-gray-500">
                          <input
                            type="checkbox"
                            checked={contractDetails[`party${i+1}Blank`]}
                            onChange={e => setContractDetails(d => ({ ...d, [`party${i+1}Blank`]: e.target.checked }))}
                          />
                          Leave blank
                        </label>
                      </div>
                      <input
                        className={`w-full px-3 py-2 border rounded mb-2 text-sm ${contractDetails[`party${i+1}Blank`] ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                        placeholder="Party Name"
                        value={contractDetails[`party${i+1}Name`] || ''}
                        onChange={e => setContractDetails(d => ({ ...d, [`party${i+1}Name`]: e.target.value }))}
                        disabled={contractDetails[`party${i+1}Blank`]}
                      />
                      <input
                        className={`w-full px-3 py-2 border rounded text-sm ${contractDetails[`party${i+1}Blank`] ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                        placeholder="Party Address"
                        value={contractDetails[`party${i+1}Address`] || ''}
                        onChange={e => setContractDetails(d => ({ ...d, [`party${i+1}Address`]: e.target.value }))}
                        disabled={contractDetails[`party${i+1}Blank`]}
                      />
                    </div>
                  </div>
                ))}
                {/* Additional Clauses/Terms */}
                <div className="flex items-center mb-4">
                  <div className="w-40">
                    <label className="block text-sm font-medium text-gray-700">Additional Clauses or Terms</label>
                    <p className="text-xs text-gray-500 mt-1">Extra terms, conditions, or special clauses</p>
                  </div>
                  <div className="flex-1">
                    <textarea
                      className="w-full px-3 py-2 border rounded text-sm"
                      placeholder="Add any extra clauses, terms, or notes here..."
                      value={contractDetails.additionalClauses || ''}
                      onChange={e => setContractDetails(d => ({ ...d, additionalClauses: e.target.value }))}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-8">
                <button
                  type="button"
                  className="mr-auto text-purple-700 hover:underline text-sm font-medium focus:outline-none"
                  onClick={handleCancel}
                >Cancel</button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium"
                  onClick={() => setStep(1)}
                >Back</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium"
                >Next</button>
              </div>
            </form>
          )}
          {step === 3 && (
            <div className="mb-8 max-w-2xl text-sm">
              <div className="text-lg font-semibold text-gray-900 mb-2">Step 3: Preview & Save</div>
              <div className="text-gray-600 mb-6">Review your contract document below. You can go back to edit details or sections.</div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                {/* Header bar: logo top center, contract name bottom left, party 1 right */}
                <div className="relative mb-10">
                  {contractDetails.logo && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
                      <img src={contractDetails.logo} alt="Logo" className="h-20 w-20 object-contain rounded mb-2" />
                    </div>
                  )}
                  <div className="flex flex-row justify-between items-end pt-24">
                    <div className="flex-1" />
                    <div className="flex flex-col items-end">
                      {contractDetails.party1Name && (
                        <div className="font-bold text-base text-gray-900" dangerouslySetInnerHTML={{__html: highlight(`<b>${contractDetails.party1Name}</b>`)}} />
                      )}
                      {contractDetails.party1Address && (
                        <div className="text-gray-500 text-sm" dangerouslySetInnerHTML={{__html: highlight(`<b>${contractDetails.party1Address}</b>`)}} />
                      )}
                    </div>
                  </div>
                  {/* Pink highlight for contractTitle, party1Name, party1Address in header */}
                  <div className="flex flex-row w-full mt-4">
                    <div className="font-bold text-lg text-gray-900 mb-1" dangerouslySetInnerHTML={{__html: contractDetails.contractTitle ? highlight(contractDetails.contractTitle) : (selectedTemplate || '')}} />
                  </div>
                </div>
                {/* NDA or template content */}
                {selectedTemplate === 'Standard NDA' ? (
                  defaultSections['Standard NDA'].map((section, idx) => {
                    let content = section.content;
                    // Remove NDA title
                    content = content.replace(/^Mutual Non-Disclosure Agreement \(NDA\)\n?/, '');
                    // Replace [Date] with highlighted and bolded date
                    const dateVal = contractDetails.effectiveDate ? highlight(`<b>${contractDetails.effectiveDate}</b>`) : '[Date]';
                    content = content.replace('[Date]', dateVal);
                    // Replace Party A/B placeholders with highlighted and bolded input
                    const partyAName = contractDetails.party1Blank ? '' : (contractDetails.party1Name ? highlight(`<b>${contractDetails.party1Name}</b>`) : '[Full Name / Company Name]');
                    const partyAAddr = contractDetails.party1Blank ? '' : (contractDetails.party1Address ? highlight(`<b>${contractDetails.party1Address}</b>`) : '[Address]');
                    const partyBName = contractDetails.party2Blank ? '' : (contractDetails.party2Name ? highlight(`<b>${contractDetails.party2Name}</b>`) : '[Full Name / Company Name]');
                    const partyBAddr = contractDetails.party2Blank ? '' : (contractDetails.party2Address ? highlight(`<b>${contractDetails.party2Address}</b>`) : '[Address]');
                    content = content
                      .replace('Party A: [Full Name / Company Name], with a principal place of business at [Address]', `Party A: ${partyAName}${partyAName && partyAAddr ? ', with a principal place of business at ' + partyAAddr : partyAAddr ? 'with a principal place of business at ' + partyAAddr : ''}`)
                      .replace('Party B: [Full Name / Company Name], with a principal place of business at [Address]', `Party B: ${partyBName}${partyBName && partyBAddr ? ', with a principal place of business at ' + partyBAddr : partyBAddr ? 'with a principal place of business at ' + partyBAddr : ''}`);
                    // Fill Party A name in signature
                    content = content.replace('Party A: _________________________', `Party A: _________________________${partyAName ? `\nName: ${partyAName}` : ''}`);
                    return (
                      <div key={idx} className="mb-6">
                        <div className="text-gray-800 whitespace-pre-line text-sm" dangerouslySetInnerHTML={{ __html: content }} />
                      </div>
                    );
                  })
                ) : sections && sections.length > 0 ? (
                  sections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <div className="font-semibold text-lg text-gray-900 mb-1">{section.title}</div>
                      <div className="text-gray-800 whitespace-pre-line">{section.content}</div>
                    </div>
                  ))
                ) : (
                  selectedTemplate && defaultSections[selectedTemplate] && defaultSections[selectedTemplate].map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <div className="font-semibold text-lg text-gray-900 mb-1">{section.title}</div>
                      <div className="text-gray-800 whitespace-pre-line">{section.content}</div>
                    </div>
                  ))
                )}
                {contractDetails.additionalClauses && (
                  <div className="mt-4">
                    <div className="font-semibold mb-1">Additional Clauses/Terms:</div>
                    <div className="whitespace-pre-line text-gray-800">{contractDetails.additionalClauses}</div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-8">
                <button
                  type="button"
                  className="mr-auto text-purple-700 hover:underline text-sm font-medium focus:outline-none"
                  onClick={handleCancel}
                >Cancel</button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium"
                  onClick={() => setStep(2)}
                >Back</button>
                <button
                  type="button"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium"
                  onClick={handleSave}
                  disabled={saving}
                >{saving ? 'Saving...' : 'Save PDF to my contracts'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContractTemplatesModal; 