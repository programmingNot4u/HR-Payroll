import { useState } from 'react'

const LeavePolicies = () => {
  const [leavePolicies, setLeavePolicies] = useState({
    casualLeave: '10',
    sickLeave: '15',
    maternityLeave: '180',
    paternityLeave: '14',
    earnedLeave: '30',
    bereavementLeave: '7',
    studyLeave: '30',
    maxCarryForward: '15',
    noticePeriod: '30',
    complianceMode: true
  })

  const handleSave = () => {
    console.log('Saving leave policies...', leavePolicies)
    // In a real app, this would make an API call
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leave Policies</h1>
          <p className="text-sm text-gray-500">Configure employee leave entitlements and rules</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Compliance Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={leavePolicies.complianceMode}
                onChange={(e) => setLeavePolicies(prev => ({ ...prev, complianceMode: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
            <span className="text-xs text-gray-500">
              {leavePolicies.complianceMode ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-2">Bereavement Leave (days)</label>
            <input
              type="number"
              value={leavePolicies.bereavementLeave}
              onChange={(e) => setLeavePolicies(prev => ({ ...prev, bereavementLeave: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Study Leave (days)</label>
            <input
              type="number"
              value={leavePolicies.studyLeave}
              onChange={(e) => setLeavePolicies(prev => ({ ...prev, studyLeave: e.target.value }))}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period (days) *</label>
            <input
              type="number"
              value={leavePolicies.noticePeriod}
              onChange={(e) => setLeavePolicies(prev => ({ ...prev, noticePeriod: e.target.value }))}
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
