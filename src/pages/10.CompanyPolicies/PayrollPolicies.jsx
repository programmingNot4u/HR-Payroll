import { useState } from 'react'

const PayrollPolicies = () => {
  const [payrollPolicies, setPayrollPolicies] = useState({
    payDay: '25th',
    overtimeRate: '1.5',
    holidayRate: '2.0',
    nightShiftAllowance: '200',
    transportAllowance: '1500',
    mealAllowance: '100',
    basicSalaryPercentage: '60',
    hraPercentage: '20',
    daPercentage: '20',
    pfPercentage: '12',
    taxThreshold: '300000',
    complianceMode: true
  })

  const handleSave = () => {
    console.log('Saving payroll policies...', payrollPolicies)
    // In a real app, this would make an API call
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Payroll Policies</h1>
          <p className="text-sm text-gray-500">Configure payroll rules, rates, and allowances</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Compliance Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={payrollPolicies.complianceMode}
                onChange={(e) => setPayrollPolicies(prev => ({ ...prev, complianceMode: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
            <span className="text-xs text-gray-500">
              {payrollPolicies.complianceMode ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pay Day *</label>
            <select
              value={payrollPolicies.payDay}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, payDay: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="25th">25th of month</option>
              <option value="30th">30th of month</option>
              <option value="1st">1st of next month</option>
              <option value="15th">15th of month</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Rate (x)</label>
            <input
              type="number"
              step="0.1"
              value={payrollPolicies.overtimeRate}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, overtimeRate: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 1.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Rate (x)</label>
            <input
              type="number"
              step="0.1"
              value={payrollPolicies.holidayRate}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, holidayRate: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 2.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Night Shift Allowance (৳)</label>
            <input
              type="number"
              value={payrollPolicies.nightShiftAllowance}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, nightShiftAllowance: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transport Allowance (৳)</label>
            <input
              type="number"
              value={payrollPolicies.transportAllowance}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, transportAllowance: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meal Allowance (৳)</label>
            <input
              type="number"
              value={payrollPolicies.mealAllowance}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, mealAllowance: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary Percentage (%)</label>
            <input
              type="number"
              value={payrollPolicies.basicSalaryPercentage}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, basicSalaryPercentage: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HRA Percentage (%)</label>
            <input
              type="number"
              value={payrollPolicies.hraPercentage}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, hraPercentage: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DA Percentage (%)</label>
            <input
              type="number"
              value={payrollPolicies.daPercentage}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, daPercentage: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PF Percentage (%)</label>
            <input
              type="number"
              value={payrollPolicies.pfPercentage}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, pfPercentage: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Threshold (৳)</label>
            <input
              type="number"
              value={payrollPolicies.taxThreshold}
              onChange={(e) => setPayrollPolicies(prev => ({ ...prev, taxThreshold: e.target.value }))}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter amount"
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
            Save Payroll Policies
          </button>
        </div>
      </div>
    </div>
  )
}

export default PayrollPolicies
