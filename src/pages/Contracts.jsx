import { useState } from 'react'

const mockContracts = [
  {
    id: 1,
    title: 'Employment Agreement - Standard',
    type: 'Employment',
    status: 'Active',
    template: 'Standard Employment Contract',
    lastUsed: '2024-01-15',
    usageCount: 45,
    description: 'Standard employment agreement template for full-time employees with standard terms and conditions.',
    keySections: ['Employment terms', 'Compensation details', 'Benefits package', 'Termination clauses'],
    approvalRequired: true,
    legalReview: 'Completed'
  },
  {
    id: 2,
    title: 'Non-Disclosure Agreement',
    type: 'Legal',
    status: 'Active',
    template: 'NDA Template',
    lastUsed: '2024-01-10',
    usageCount: 23,
    description: 'Standard non-disclosure agreement for employees, contractors, and business partners.',
    keySections: ['Confidentiality terms', 'Duration of agreement', 'Return of materials', 'Legal remedies'],
    approvalRequired: true,
    legalReview: 'Completed'
  }
]

export default function Contracts() {
  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='bg-gray-800 border-b border-gray-700 px-6 py-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white'>Company Contracts</h1>
              <p className='text-gray-400'>Manage contract templates, agreements, and legal documents</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {mockContracts.map(contract => (
            <div key={contract.id} className='bg-gray-800 rounded-xl border border-gray-700 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-white'>{contract.title}</h3>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                  {contract.status}
                </span>
              </div>
              <p className='text-gray-400 text-sm mb-3'>{contract.description}</p>
              <div className='flex gap-2 mb-3'>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                  {contract.type}
                </span>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'>
                  {contract.template}
                </span>
                <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800'>
                  {contract.legalReview}
                </span>
              </div>
              <div className='text-xs text-gray-400 mb-3'>
                Last used: {contract.lastUsed} | Used {contract.usageCount} times
              </div>
              <div className='text-sm text-gray-300'>
                <div className='font-medium mb-2'>Key Sections:</div>
                <div className='space-y-1'>
                  {contract.keySections.map((section, index) => (
                    <div key={index} className='text-xs text-gray-400'>• {section}</div>
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
