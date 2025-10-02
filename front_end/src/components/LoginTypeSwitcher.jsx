// front_end/src/components/LoginTypeSwitcher.jsx

import React from 'react'

const LoginTypeSwitcher = ({ currentType, onSwitch }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex space-x-1">
          <button
            onClick={() => onSwitch('admin')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentType === 'admin'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => onSwitch('employee')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentType === 'employee'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Employee
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginTypeSwitcher