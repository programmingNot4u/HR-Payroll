import { useState, useEffect } from 'react'

const LeavePolicies = () => {
  const [leavePolicies, setLeavePolicies] = useState({
    casualLeave: '10',
    sickLeave: '15',
    maternityLeave: '180',
    paternityLeave: '14',
    earnedLeave: '30',
    leaveWithoutPay: '0',
    maxCarryForward: '15'
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Load leave policies from localStorage on component mount
  useEffect(() => {
    const savedPolicies = localStorage.getItem('leavePolicies')
    if (savedPolicies) {
      try {
        const parsedPolicies = JSON.parse(savedPolicies)
        setLeavePolicies(parsedPolicies)
      } catch (error) {
        console.error('Error loading leave policies:', error)
      }
    }
  }, [])

  const handleSave = () => {
    try {
      // Save to localStorage
      localStorage.setItem('leavePolicies', JSON.stringify(leavePolicies))
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('leavePoliciesChanged'))
      
      // Show success message
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
      
      console.log('Leave policies saved successfully:', leavePolicies)
    } catch (error) {
      console.error('Error saving leave policies:', error)
      alert('Error saving leave policies. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Leave Policies</h1>
        <p className="text-sm text-gray-500">Configure employee leave entitlements and rules</p>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Leave policies saved successfully!</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Casual Leave (days/year) *</label>
            <input
              type="number"
              value={leavePolicies.casualLeave}
              onChange={(e) => setLeavePolicies(prev => ({ ...prev, casualLeave: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sick Leave (days/year) *</label>
            <input
              type="number"
              value={leavePolicies.sickLeave}
              onChange={(e) => setLeavePolicies(prev => ({ ...prev, sickLeave: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maternity Leave (days) *</label>
            <input
              type="number"
              value={leavePolicies.maternityLeave}
              onChange={(e) => setLeavePolicies(prev => ({ ...prev, maternityLeave: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paternity Leave (days)</label>
            <input
              type="number"
              value={leavePolicies.paternityLeave}
              onChange={(e) => setLeavePolicies(prev => ({ ...prev, paternityLeave: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Earned Leave (days/year) *</label>
            <input
              type="number"
              value={leavePolicies.earnedLeave}
              onChange={(e) => setLeavePolicies(prev => ({ ...prev, earnedLeave: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Leave Without Pay (days/year)</label>
            <input
              type="number"
              value={leavePolicies.leaveWithoutPay}
              onChange={(e) => setLeavePolicies(prev => ({ ...prev, leaveWithoutPay: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Carry Forward (days)</label>
            <input
              type="number"
              value={leavePolicies.maxCarryForward}
              onChange={(e) => setLeavePolicies(prev => ({ ...prev, maxCarryForward: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter days"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            * Required fields
          </div>
          <button
            onClick={handleSave}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors"
          >
            Save Leave Policies
          </button>
        </div>
      </div>
    </div>
  )
}

export default LeavePolicies
