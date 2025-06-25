import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { fetchEmployees } from '../../../../services/employeesService';

function buildTree(employees) {
  const map = {};
  employees.forEach(emp => (map[emp.id] = { ...emp, children: [] }));
  const roots = [];
  employees.forEach(emp => {
    if (emp.manager_id && map[emp.manager_id]) {
      map[emp.manager_id].children.push(map[emp.id]);
    } else {
      roots.push(map[emp.id]);
    }
  });
  return roots;
}

// Helper to find the path from the root to the selected person (by id)
const findReportingPath = (node, selectedId) => {
  if (node.id === selectedId) {
    return [node.id];
  }
  if (node.children) {
    for (const child of node.children) {
      const path = findReportingPath(child, selectedId);
      if (path) {
        return [node.id, ...path];
      }
    }
  }
  return null;
};

const MemberNode = ({ member, isRoot = false, onSelect, selectedId, reportingPath }) => {
  const isSelected = member.id === selectedId;
  const isInPath = reportingPath.includes(member.id);
  const hasChildInPath = member.children?.some(c => reportingPath.includes(c.id));

  return (
    <div className={`relative flex flex-col items-center ${isRoot ? '' : 'pt-8 min-h-[64px]'}`} style={{ minWidth: '176px' }}>
      {/* Connecting line from parent */}
      {!isRoot && (
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 z-0 ${isInPath ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
      )}
      {/* Member Box */}
      <button
        onClick={() => onSelect(member.id)}
        className={`relative block text-left bg-white border ${isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-300'} rounded-md shadow-sm p-2 w-44 z-10 hover:border-purple-400 transition-all duration-150`}
      >
        <h3 className="text-sm font-bold text-gray-900 text-center">{member.name}</h3>
        <p className="text-xs text-purple-600 font-semibold text-center">{member.position}</p>
        <p className="text-xs text-gray-500 text-center mt-1">{member.department}</p>
      </button>
      {/* Render children if they exist */}
      {member.children && member.children.length > 0 && (
        <>
          {/* Vertical line connecting to children's horizontal bar */}
          <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 z-0 ${hasChildInPath ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
          <div className="flex justify-center mt-8 relative w-full min-w-max">
            {/* Horizontal connecting line - only if more than one child */}
            {member.children.length > 1 && (
              <div className={`absolute top-0 left-0 right-0 h-0.5 z-0 ${hasChildInPath ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
            )}
            {member.children.map((child, idx) => (
              <div key={child.id} className="px-2 flex flex-col items-center">
                <MemberNode
                  member={child}
                  onSelect={onSelect}
                  selectedId={selectedId}
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
  const { currentOrganization } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!currentOrganization) return;
    setLoading(true);
    fetchEmployees(currentOrganization.organization_id)
      .then(setEmployees)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [currentOrganization]);

  if (!currentOrganization) return <div>Select an organization</div>;
  if (loading) return <div>Loading org chart...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const tree = buildTree(employees);
  // Find reporting path for highlighting
  let reportingPath = [];
  if (selectedId && tree.length > 0) {
    for (const root of tree) {
      const path = findReportingPath(root, selectedId);
      if (path) {
        reportingPath = path;
        break;
      }
    }
  }

  return (
    <div className="overflow-x-auto p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Organization Chart</h2>
      <div className="flex justify-center min-w-max">
        {tree.map(root => (
          <MemberNode
            key={root.id}
            member={root}
            isRoot={true}
            onSelect={setSelectedId}
            selectedId={selectedId}
            reportingPath={reportingPath}
          />
        ))}
      </div>
    </div>
  );
};

export default OrgChart; 