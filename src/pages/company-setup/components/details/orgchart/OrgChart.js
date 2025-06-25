import React, { useState } from 'react';
import Card from '../../../../../components/common/layout/Card';

// Helper to find the path from the root to the selected person
const findReportingPath = (node, selectedName) => {
  if (node.name === selectedName) {
    return [node.name];
  }
  if (node.children) {
    for (const child of node.children) {
      const path = findReportingPath(child, selectedName);
      if (path) {
        return [node.name, ...path];
      }
    }
  }
  return null;
};

const MemberNode = ({ member, isRoot = false, onSelect, selectedPersonName, reportingPath }) => {
  const isSelected = member.name === selectedPersonName;
  const isInPath = reportingPath.includes(member.name);
  const hasChildInPath = member.children?.some(c => reportingPath.includes(c.name));

  return (
    <div className={`relative flex flex-col items-center ${isRoot ? '' : 'pt-8'}`}>
      {/* Connecting line from parent */}
      {!isRoot && <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 ${isInPath ? 'bg-blue-500' : 'bg-gray-300'}`}></div>}
      
      {/* Member Box */}
      <button 
        onClick={() => onSelect(member.name)}
        className={`relative block text-left bg-white border ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} rounded-md shadow-sm p-2 w-40 z-10 hover:border-blue-400 transition-all duration-150`}
      >
        <h3 className="text-sm font-bold text-gray-900 text-center">{member.name}</h3>
        <p className="text-xs text-primary-600 font-semibold text-center">{member.role}</p>
        <p className="text-xs text-gray-500 text-center mt-1">{member.team}</p>
      </button>
      
      {/* Render children if they exist */}
      {member.children && member.children.length > 0 && (
        <>
          {/* Vertical line connecting to children's horizontal bar */}
          <div className={`absolute top-full w-px h-8 ${hasChildInPath ? 'bg-blue-500' : 'bg-gray-300'}`}></div>

          <div className="flex justify-center mt-8 relative">
            {/* Horizontal connecting line - only if more than one child */}
            {member.children.length > 1 && (
              <div className={`absolute top-0 left-0 right-0 h-px ${hasChildInPath ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            )}
            
            {member.children.map((child) => (
              <div key={child.name} className="px-2">
                <MemberNode 
                  member={child} 
                  onSelect={onSelect} 
                  selectedPersonName={selectedPersonName}
                  reportingPath={reportingPath}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const OrgChart = () => {
  const [selectedPersonName, setSelectedPersonName] = useState(null);

  const handleSelectPerson = (name) => {
    setSelectedPersonName(prev => prev === name ? null : name);
  };

  const orgData = {
    name: 'Eleanor Vance',
    role: 'CEO',
    team: 'Executive',
    children: [
      {
        name: 'Marcus Holloway',
        role: 'CTO',
        team: 'Technology',
        children: [
          {
            name: 'Aiden Pearce',
            role: 'Lead Engineer',
            team: 'Engineering',
            children: [
                { name: 'Clara Lille', role: 'Frontend Dev', team: 'Engineering' },
                { name: 'Raymond Kenney', role: 'Backend Dev', team: 'Engineering' },
            ]
          },
          {
            name: 'Javier Vega',
            role: 'Head of Product',
            team: 'Product',
            children: [
                { name: 'Sitara Dhawan', role: 'Product Manager', team: 'Product' },
            ]
          },
        ],
      },
      {
        name: 'Miranda Lawson',
        role: 'COO',
        team: 'Operations',
        children: [
          { name: 'Jacob Taylor', role: 'Ops Manager', team: 'Operations' },
          { name: 'Kasumi Goto', role: 'HR Manager', team: 'Human Resources' },
        ],
      },
    ],
  };

  const reportingPath = findReportingPath(orgData, selectedPersonName) || [];

  return (
    <Card>
      <div className="overflow-x-auto p-4">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Organization Chart</h2>
        <div className="flex justify-center min-w-max">
          <MemberNode 
            member={orgData} 
            isRoot={true} 
            onSelect={handleSelectPerson} 
            selectedPersonName={selectedPersonName}
            reportingPath={reportingPath}
          />
        </div>
      </div>
    </Card>
  );
};

export default OrgChart; 