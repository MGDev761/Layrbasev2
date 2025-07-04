import React, { useState, useEffect, useRef } from 'react';
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

const MemberNode = ({ member, isRoot = false, onSelect, selectedId, reportingPath, onEmployeeClick }) => {
  const [expanded, setExpanded] = useState(true);
  const isSelected = member.id === selectedId;
  const isInPath = reportingPath.includes(member.id);
  const hasChildInPath = member.children?.some(c => reportingPath.includes(c.id));
  const hasChildren = member.children && member.children.length > 0;

  // --- For dynamic line positioning ---
  const childrenRefs = useRef([]);
  const horizLineRef = useRef(null);
  const [horizLineStyle, setHorizLineStyle] = useState({ left: '0px', width: '0px', top: '0px' });

  useEffect(() => {
    if (member.children && member.children.length > 1 && expanded) {
      const first = childrenRefs.current[0];
      const last = childrenRefs.current[member.children.length - 1];
      if (first && last && horizLineRef.current) {
        const parentRect = horizLineRef.current.parentNode.getBoundingClientRect();
        const firstRect = first.getBoundingClientRect();
        const lastRect = last.getBoundingClientRect();
        const left = (firstRect.left + firstRect.width / 2) - parentRect.left;
        const right = (lastRect.left + lastRect.width / 2) - parentRect.left;
        setHorizLineStyle({
          left: `${left}px`,
          width: `${right - left}px`,
          top: '0px',
        });
      }
    }
  }, [member.children, expanded]);

  return (
    <div className={`relative flex flex-col items-center ${isRoot ? '' : 'pt-0 min-h-0'}`} style={{ minWidth: '176px' }}>
      {/* Member Box + Expand/Collapse */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={() => onEmployeeClick ? onEmployeeClick(member) : onSelect(member.id)}
          className={`relative block text-left bg-white border ${isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-300'} rounded-md shadow-sm p-2 w-44 z-10 hover:border-purple-400 transition-all duration-150 min-h-[140px]`}
          style={{ minHeight: 140 }}
        >
          <h3 className="text-sm font-bold text-gray-900 text-center">{member.name}</h3>
          <p className="text-xs text-purple-600 font-semibold text-center">{member.position}</p>
          <p className="text-xs text-gray-500 text-center mt-1">{member.department}</p>
          {/* Footer with team size and expand/collapse */}
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>{hasChildren ? `${member.children.length} on team` : 'No team'}</span>
            {hasChildren && (
              <button
                className="ml-2 bg-gray-100 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200 z-20"
                onClick={e => { e.stopPropagation(); setExpanded(e2 => !e2); }}
                aria-label={expanded ? 'Collapse' : 'Expand'}
                type="button"
              >
                {expanded ? <span>&#8722;</span> : <span>&#43;</span>}
              </button>
            )}
          </div>
        </button>
      </div>
      {/* Render children if expanded */}
      {hasChildren && expanded && (
        <div className="relative w-full flex flex-col items-center" style={{ minHeight: '40px' }}>
          {/* Vertical line from parent to horizontal line (overlap by 1px for perfect join) */}
          <div className={`absolute left-1/2 -translate-x-1/2 top-0 w-0.5 z-10 ${hasChildInPath ? 'bg-purple-500' : 'bg-gray-300'}`} style={{ height: '21px' }}></div>
          {/* Horizontal line above children, dynamically positioned (move up by 1px for perfect join) */}
          {member.children.length > 1 && (
            <div ref={horizLineRef} className={`absolute h-0.5 z-0 ${hasChildInPath ? 'bg-purple-500' : 'bg-gray-300'}`} style={{ ...horizLineStyle, position: 'absolute', top: '20px' }}></div>
          )}
          {/* Children row with consistent gap */}
          <div className="flex flex-row justify-center items-start gap-x-8 relative w-full min-w-max" style={{ marginTop: '20px' }}>
            {member.children.map((child, idx) => (
              <div key={child.id} className="flex flex-col items-center relative" ref={el => childrenRefs.current[idx] = el}>
                {/* Vertical line from horizontal to child box, perfectly centered */}
                {member.children.length > 1 && (
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 z-10 ${hasChildInPath ? 'bg-purple-500' : 'bg-gray-300'}`} style={{ height: '20px' }}></div>
                )}
                {/* Recursive: render child node and its own children below */}
                <MemberNode
                  member={child}
                  onSelect={onSelect}
                  selectedId={selectedId}
                  reportingPath={reportingPath}
                  onEmployeeClick={onEmployeeClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const OrgChart = ({ onEmployeeClick }) => {
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
            onEmployeeClick={onEmployeeClick}
          />
        ))}
      </div>
    </div>
  );
};

export default OrgChart; 