import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { fetchEmployees } from '../../../../services/employeesService';

// Build hierarchical tree structure from flat employee list
function buildTree(employees) {
  const map = {};
  const roots = [];
  
  // Create map of all employees
  employees.forEach(emp => {
    map[emp.id] = { ...emp, children: [] };
  });
  
  // Build hierarchy
  employees.forEach(emp => {
    if (emp.manager_id && map[emp.manager_id]) {
      map[emp.manager_id].children.push(map[emp.id]);
    } else {
      roots.push(map[emp.id]);
    }
  });
  
  // Sort children by name for consistent display
  Object.values(map).forEach(emp => {
    emp.children.sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return roots.sort((a, b) => a.name.localeCompare(b.name));
}

// Get employee avatar initials
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generate consistent colors based on department
const getDepartmentColor = (department) => {
  if (!department) return 'bg-gray-500';
  
  const colors = {
    'engineering': 'bg-blue-500',
    'marketing': 'bg-green-500',
    'sales': 'bg-purple-500',
    'hr': 'bg-pink-500',
    'finance': 'bg-yellow-500',
    'operations': 'bg-indigo-500',
    'design': 'bg-red-500',
    'product': 'bg-cyan-500',
    'executive': 'bg-gray-700',
    'tech': 'bg-blue-600'
  };
  
  const dept = department.toLowerCase();
  for (const [key, color] of Object.entries(colors)) {
    if (dept.includes(key)) return color;
  }
  
  return 'bg-gray-500';
};

const TreeNode = ({ employee, onEmployeeClick, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = employee.children && employee.children.length > 0;
  const departmentColor = getDepartmentColor(employee.department);

  return (
    <div className="flex flex-col items-center">
      {/* Employee Card */}
      <div 
        className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group p-4 min-w-60"
        onClick={() => onEmployeeClick && onEmployeeClick(employee)}
      >
        {/* Main Content */}
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-full ${departmentColor} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
            {getInitials(employee.name)}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors truncate">
              {employee.name}
            </h3>
            <p className="text-xs text-gray-600 font-medium truncate">
              {employee.position || 'No position'}
            </p>
            {employee.department && (
              <p className="text-xs text-gray-500 truncate">
                {employee.department}
              </p>
            )}
          </div>
          
          {/* Expand Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg 
                className={`w-3 h-3 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Team Count */}
        {hasChildren && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {employee.children.length} report{employee.children.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-6 relative">
          {/* Connecting line */}
          <div className="absolute top-0 left-1/2 w-px h-6 bg-gray-300 transform -translate-x-1/2"></div>
          
          {/* Children container */}
          <div className="pt-6">
            {employee.children.length === 1 ? (
              // Single child - centered
              <TreeNode 
                employee={employee.children[0]} 
                onEmployeeClick={onEmployeeClick}
                level={level + 1}
              />
            ) : (
              // Multiple children - horizontal layout
              <div className="relative">
                {/* Horizontal line */}
                <div 
                  className="absolute top-0 h-px bg-gray-300"
                  style={{
                    left: '50%',
                    right: '50%',
                    width: `${(employee.children.length - 1) * 280}px`,
                    marginLeft: `${-(employee.children.length - 1) * 140}px`
                  }}
                ></div>
                
                {/* Children */}
                <div className="flex justify-center gap-70">
                  {employee.children.map((child) => (
                    <div key={child.id} className="relative">
                      {/* Vertical connector */}
                      <div className="absolute top-0 left-1/2 w-px h-6 bg-gray-300 transform -translate-x-1/2"></div>
                      <div className="pt-6">
                        <TreeNode 
                          employee={child} 
                          onEmployeeClick={onEmployeeClick}
                          level={level + 1}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex justify-center">
    <div className="bg-white rounded-lg border border-gray-200 p-4 min-w-60 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employees Found</h3>
    <p className="text-gray-600 text-sm max-w-sm">
      Add some employees to see your organization chart. Click the "Add Employee" button to get started.
    </p>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Organization Chart</h3>
    <p className="text-gray-600 text-sm max-w-sm mb-4">
      {error?.message || 'There was an error loading the organization chart.'}
    </p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Try Again
    </button>
  </div>
);

const OrgChart = ({ onEmployeeClick }) => {
  const { currentOrganization } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEmployees = async () => {
    if (!currentOrganization) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchEmployees(currentOrganization.organization_id);
      setEmployees(data);
    } catch (err) {
      console.error('Error loading employees:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [currentOrganization]);

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-500">Please select an organization to view the chart.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Organization Chart</h2>
          <p className="text-sm text-gray-600 mt-1">Loading team structure...</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Organization Chart</h2>
        </div>
        <ErrorState error={error} onRetry={loadEmployees} />
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Organization Chart</h2>
          <p className="text-sm text-gray-600 mt-1">Visual representation of your team structure</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  const tree = buildTree(employees);

  return (
    <div className="p-8 bg-gray-50 min-h-96">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Organization Chart</h2>
        <p className="text-sm text-gray-600 mt-1">
          {employees.length} employee{employees.length !== 1 ? 's' : ''} • Click on any card to view details
        </p>
      </div>

      {/* Chart Container */}
      <div className="overflow-x-auto pb-8">
        <div className="min-w-fit mx-auto">
          <div className="flex justify-center space-x-16">
            {tree.map(root => (
              <TreeNode
                key={root.id}
                employee={root}
                onEmployeeClick={onEmployeeClick}
                level={0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200 bg-white rounded-lg p-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            💡 Click employee cards to view profiles • Use arrows to expand/collapse teams
          </p>
          <div className="flex justify-center items-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Engineering/Tech</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Sales</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Marketing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
              <span className="text-gray-600">Executive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgChart; 