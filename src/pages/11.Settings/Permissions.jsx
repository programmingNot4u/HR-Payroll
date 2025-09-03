import { useState } from 'react'

const mockPermissions = [
  {
    id: 1,
    name: 'employee_view',
    displayName: 'View Employee',
    description: 'Ability to view employee information and profiles',
    category: 'Employee Management',
    type: 'READ',
    risk: 'LOW',
    status: 'Active',
    roles: ['HR Manager', 'Department Manager', 'Employee', 'Recruiter']
  },
  {
    id: 2,
    name: 'employee_create',
    displayName: 'Create Employee',
    description: 'Ability to create new employee records and accounts',
    category: 'Employee Management',
    type: 'CREATE',
    risk: 'MEDIUM',
    status: 'Active',
    roles: ['HR Manager', 'Recruiter']
  }
]

export default function Permissions() {
  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='bg-gray-800 border-b border-gray-700 px-6 py-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-700 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
              </svg>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white'>Permissions Management</h1>
              <p className='text-gray-400'>Define and manage system permissions and access controls</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='bg-gray-800 rounded-xl border border-gray-700 p-6'>
          <h2 className='text-xl font-semibold text-white mb-4'>System Permissions</h2>
          <div className='space-y-4'>
            {mockPermissions.map(permission => (
              <div key={permission.id} className='bg-gray-700 rounded-lg p-4 border border-gray-600'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-lg font-medium text-white'>{permission.displayName}</h3>
                  <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                    {permission.status}
                  </span>
                </div>
                <p className='text-gray-400 text-sm mb-3'>{permission.description}</p>
                <div className='flex gap-2'>
                  <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                    {permission.category}
                  </span>
                  <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'>
                    {permission.type}
                  </span>
                  <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800'>
                    {permission.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
