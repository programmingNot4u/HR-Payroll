import { useState } from 'react'

const mockEmployeeDocuments = [
  {
    id: 1,
    title: 'Employee Handbook',
    category: 'HR & Policies',
    status: 'Active',
    version: '2024.1',
    lastUpdated: '2024-01-15',
    updatedBy: 'HR Director',
    description: 'Comprehensive employee handbook covering company policies, procedures, and employee rights.',
    documentType: 'PDF',
    fileSize: '2.4 MB',
    downloadCount: 156,
    readCount: 234,
    tags: ['policies', 'procedures', 'employee rights', 'company culture']
  },
  {
    id: 2,
    title: 'Performance Review Form',
    category: 'Performance Management',
    status: 'Active',
    version: '3.2',
    lastUpdated: '2024-01-10',
    updatedBy: 'HR Manager',
    description: 'Standard performance review form for annual employee evaluations and goal setting.',
    documentType: 'Word Document',
    fileSize: '156 KB',
    downloadCount: 89,
    readCount: 145,
    tags: ['performance', 'evaluation', 'goals', 'feedback']
  },
  {
    id: 3,
    title: 'Leave Request Form',
    category: 'Time & Attendance',
    status: 'Active',
    version: '2.1',
    lastUpdated: '2024-01-08',
    updatedBy: 'HR Coordinator',
    description: 'Standard leave request form for vacation, sick leave, and other time-off requests.',
    documentType: 'PDF',
    fileSize: '89 KB',
    downloadCount: 67,
    readCount: 123,
    tags: ['leave', 'vacation', 'sick leave', 'time off']
  },
  {
    id: 4,
    title: 'Expense Reimbursement Form',
    category: 'Finance & Expenses',
    status: 'Active',
    version: '1.8',
    lastUpdated: '2024-01-05',
    updatedBy: 'Finance Manager',
    description: 'Form for submitting and tracking business expense reimbursements.',
    documentType: 'Excel',
    fileSize: '45 KB',
    downloadCount: 34,
    readCount: 78,
    tags: ['expenses', 'reimbursement', 'finance', 'tracking']
  }
]

export default function EmployeeDocuments() {
  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='bg-gray-800 border-b border-gray-700 px-6 py-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-700 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white'>Employee Documents</h1>
              <p className='text-gray-400'>Access and manage employee-related documents, forms, and resources</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {mockEmployeeDocuments.map(document => (
            <div key={document.id} className='bg-gray-800 rounded-xl border border-gray-700 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-white'>{document.title}</h3>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                  {document.status}
                </span>
              </div>
              <p className='text-gray-400 text-sm mb-3'>{document.description}</p>
              <div className='flex gap-2 mb-3'>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                  {document.category}
                </span>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'>
                  v{document.version}
                </span>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800'>
                  {document.documentType}
                </span>
              </div>
              <div className='text-xs text-gray-400 mb-3'>
                Updated: {document.lastUpdated} by {document.updatedBy}
              </div>
              <div className='flex items-center justify-between text-sm text-gray-400 mb-3'>
                <span>📁 {document.fileSize}</span>
                <span>📖 {document.readCount} reads</span>
                <span>⬇️ {document.downloadCount} downloads</span>
              </div>
              <div className='text-sm text-gray-300'>
                <div className='font-medium mb-2'>Tags:</div>
                <div className='flex flex-wrap gap-1'>
                  {document.tags.map((tag, index) => (
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
