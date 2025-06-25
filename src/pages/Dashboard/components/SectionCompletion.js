import React from 'react';
import Card from '../../../components/common/layout/Card';

const SectionCompletion = ({ sections }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Section Completion</h2>
      <Card className="p-6 h-[280px]">
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.name} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{section.name}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`${section.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${section.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-12">{section.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SectionCompletion; 
import Card from '../../../components/common/layout/Card';

const SectionCompletion = ({ sections }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Section Completion</h2>
      <Card className="p-6">
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.name} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{section.name}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`${section.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${section.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-12">{section.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SectionCompletion; 