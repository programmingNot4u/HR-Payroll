import { useState } from 'react'

const mockTemplates = [
  {
    id: 1,
    title: 'New Employee Onboarding Checklist',
    category: 'HR & Recruitment',
    status: 'Active',
    version: '2.3',
    lastUpdated: '2024-01-15',
    updatedBy: 'HR Manager',
    description: 'Comprehensive checklist template for new employee onboarding process.',
    templateType: 'Checklist',
    estimatedTime: '2-3 hours',
    usageCount: 67,
    downloadCount: 45,
    sections: ['Pre-boarding', 'First Day', 'First Week', 'First Month'],
    tags: ['onboarding', 'checklist', 'new employee', 'hr process']
  },
  {
    id: 2,
    title: 'Performance Improvement Plan',
    category: 'Performance Management',
    status: 'Active',
    version: '1.9',
    lastUpdated: '2024-01-12',
    updatedBy: 'HR Director',
    description: 'Template for creating performance improvement plans for underperforming employees.',
    templateType: 'Form',
    estimatedTime: '1-2 hours',
    usageCount: 23,
    downloadCount: 18,
    sections: ['Performance Issues', 'Goals & Objectives', 'Action Plan', 'Timeline', 'Follow-up'],
    tags: ['performance', 'improvement', 'pip', 'hr management']
  },
  {
    id: 3,
    title: 'Incident Report Form',
    category: 'Health & Safety',
    status: 'Active',
    version: '1.5',
    lastUpdated: '2024-01-08',
    updatedBy: 'Safety Manager',
    description: 'Standard incident report form for workplace accidents and safety incidents.',
    templateType: 'Form',
    estimatedTime: '30-45 minutes',
    usageCount: 34,
    downloadCount: 28,
    sections: ['Incident Details', 'Witnesses', 'Actions Taken', 'Prevention Measures'],
    tags: ['incident', 'safety', 'accident', 'reporting']
  },
  {
    id: 4,
    title: 'Meeting Agenda Template',
    category: 'Communication',
    status: 'Active',
    version: '1.2',
    lastUpdated: '2024-01-05',
    updatedBy: 'Office Manager',
    description: 'Professional meeting agenda template for team meetings and project discussions.',
    templateType: 'Document',
    estimatedTime: '15-30 minutes',
    usageCount: 89,
    downloadCount: 67,
    sections: ['Meeting Details', 'Agenda Items', 'Action Items', 'Next Steps'],
    tags: ['meeting', 'agenda', 'communication', 'project management']
  }
]

export default function Templates() {
  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='bg-gray-800 border-b border-gray-700 px-6 py-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
              </svg>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white'>Document Templates</h1>
              <p className='text-gray-400'>Access and manage reusable document templates and forms</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {mockTemplates.map(template => (
            <div key={template.id} className='bg-gray-800 rounded-xl border border-gray-700 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-white'>{template.title}</h3>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                  {template.status}
                </span>
              </div>
              <p className='text-gray-400 text-sm mb-3'>{template.description}</p>
              <div className='flex gap-2 mb-3'>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                  {template.category}
                </span>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'>
                  {template.templateType}
                </span>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800'>
                  v{template.version}
                </span>
              </div>
              <div className='text-xs text-gray-400 mb-3'>
                Updated: {template.lastUpdated} by {template.updatedBy}
              </div>
              <div className='flex items-center justify-between text-sm text-gray-400 mb-3'>
                <span>⏱️ {template.estimatedTime}</span>
                <span>📖 {template.usageCount} uses</span>
                <span>⬇️ {template.downloadCount} downloads</span>
              </div>
              <div className='text-sm text-gray-300 mb-3'>
                <div className='font-medium mb-2'>Template Sections:</div>
                <div className='flex flex-wrap gap-1'>
                  {template.sections.map((section, index) => (
                    <span key={index} className='inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300'>
                      {section}
                    </span>
                  ))}
                </div>
              </div>
              <div className='text-sm text-gray-300'>
                <div className='font-medium mb-2'>Tags:</div>
                <div className='flex flex-wrap gap-1'>
                  {template.tags.map((tag, index) => (
                    <span key={index} className='inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
