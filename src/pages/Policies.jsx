import { useState } from 'react'

const mockPolicies = [
  {
    id: 1,
    title: 'Employee Code of Conduct',
    category: 'HR & Ethics',
    status: 'Active',
    version: '3.2',
    lastUpdated: '2024-01-15',
    updatedBy: 'HR Director',
    approvalStatus: 'Approved',
    description: 'Comprehensive guidelines for employee behavior, ethics, and professional conduct in the workplace.',
    keyPoints: ['Professional behavior standards', 'Conflict of interest guidelines', 'Harassment and discrimination policies'],
    readCount: 156,
    downloadCount: 89
  },
  {
    id: 2,
    title: 'Information Security Policy',
    category: 'IT & Security',
    status: 'Active',
    version: '2.1',
    lastUpdated: '2024-01-10',
    updatedBy: 'IT Security Manager',
    approvalStatus: 'Approved',
    description: 'Comprehensive security guidelines covering data protection, access control, and cybersecurity best practices.',
    keyPoints: ['Password requirements and management', 'Data classification and handling', 'Remote work security protocols'],
    readCount: 134,
    downloadCount: 67
  }
]

export default function Policies() {
  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='bg-gray-800 border-b border-gray-700 px-6 py-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white'>Company Policies</h1>
              <p className='text-gray-400'>Manage and maintain company policies, procedures, and guidelines</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {mockPolicies.map(policy => (
            <div key={policy.id} className='bg-gray-800 rounded-xl border border-gray-700 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-white'>{policy.title}</h3>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                  {policy.status}
                </span>
              </div>
              <p className='text-gray-400 text-sm mb-3'>{policy.description}</p>
              <div className='flex gap-2 mb-3'>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                  {policy.category}
                </span>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'>
                  v{policy.version}
                </span>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                  {policy.approvalStatus}
                </span>
              </div>
              <div className='text-xs text-gray-400 mb-3'>
                Updated: {policy.lastUpdated} by {policy.updatedBy}
              </div>
              <div className='flex items-center justify-between text-sm text-gray-400'>
                <span> {policy.readCount} reads</span>
                <span> {policy.downloadCount} downloads</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
