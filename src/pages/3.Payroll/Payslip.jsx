import { useState, useEffect } from 'react'

export default function Payslip() {
  const [employeeData, setEmployeeData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading employee data
    setTimeout(() => {
      setEmployeeData({
        id: 'EMP001',
        name: 'Ahmed Khan',
        designation: 'Senior Tailor',
        department: 'Sewing',
        month: 'August',
        year: '2024',
        
        // Salary Information
        basicSalary: 20000,
        houseRent: 3000,
        medicalAllowance: 1000,
        transportAllowance: 500,
        otherAllowances: 500,
        grossSalary: 25000,
        
        // Attendance Information
        totalDays: 26,
        presentDays: 24,
        absentDays: 2,
        lateDays: 1,
        halfDays: 0,
        
        // Leave Information
        casualLeave: 2,
        sickLeave: 0,
        earnedLeave: 0,
        maternityLeave: 0,
        totalLeaveDays: 2,
        
        // Overtime Information
        overtimeHours: 12,
        overtimeRate: 200,
        overtimeAmount: 2400,
        
        // Deductions
        absentDeduction: 1000,
        lateDeduction: 200,
        penaltyDeduction: 0,
        otherDeductions: 0,
        totalDeductions: 1200,
        
        // Net Salary
        netSalary: 26200,
        paidAmount: 20000,
        remainingAmount: 6200,
        
        // Bank Information
        bankName: 'Sonali Bank',
        accountNumber: '1234567890',
        branchName: 'Dhaka Main Branch'
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payslip...</p>
        </div>
      </div>
    )
  }

  if (!employeeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Employee data not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RP Creations & Apparels Limited</h1>
              <p className="text-gray-600 mt-2">Salary Payslip</p>
              <p className="text-gray-600">For the month of {employeeData.month} {employeeData.year}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">৳{employeeData.netSalary.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Net Salary</div>
            </div>
          </div>
        </div>

        {/* Employee Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Employee Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Employee ID</label>
              <p className="text-lg font-semibold">{employeeData.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold">{employeeData.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Designation</label>
              <p className="text-lg font-semibold">{employeeData.designation}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Department</label>
              <p className="text-lg font-semibold">{employeeData.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Month</label>
              <p className="text-lg font-semibold">{employeeData.month} {employeeData.year}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Payment Date</label>
              <p className="text-lg font-semibold">{(() => {
                const date = new Date()
                const day = String(date.getDate()).padStart(2, '0')
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const year = date.getFullYear()
                return `${day}/${month}/${year}`
              })()}</p>
            </div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Salary Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div>
              <h3 className="text-lg font-medium text-green-600 mb-3">Earnings</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-semibold">৳{employeeData.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">House Rent Allowance</span>
                  <span className="font-semibold">৳{employeeData.houseRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medical Allowance</span>
                  <span className="font-semibold">৳{employeeData.medicalAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport Allowance</span>
                  <span className="font-semibold">৳{employeeData.transportAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Other Allowances</span>
                  <span className="font-semibold">৳{employeeData.otherAllowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime</span>
                  <span className="font-semibold">৳{employeeData.overtimeAmount.toLocaleString()}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Gross Salary</span>
                  <span>৳{employeeData.grossSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="text-lg font-medium text-red-600 mb-3">Deductions</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Absent Deduction</span>
                  <span className="font-semibold text-red-600">-৳{employeeData.absentDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Late Deduction</span>
                  <span className="font-semibold text-red-600">-৳{employeeData.lateDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Penalty</span>
                  <span className="font-semibold text-red-600">-৳{employeeData.penaltyDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Other Deductions</span>
                  <span className="font-semibold text-red-600">-৳{employeeData.otherDeductions.toLocaleString()}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold text-red-600">
                  <span>Total Deductions</span>
                  <span>-৳{employeeData.totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance & Leave Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Attendance & Leave Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attendance */}
            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-3">Attendance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Working Days</span>
                  <span className="font-semibold">{employeeData.totalDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Present Days</span>
                  <span className="font-semibold text-green-600">{employeeData.presentDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Absent Days</span>
                  <span className="font-semibold text-red-600">{employeeData.absentDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Late Days</span>
                  <span className="font-semibold text-yellow-600">{employeeData.lateDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Half Days</span>
                  <span className="font-semibold text-orange-600">{employeeData.halfDays}</span>
                </div>
              </div>
            </div>

            {/* Leave */}
            <div>
              <h3 className="text-lg font-medium text-purple-600 mb-3">Leave Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Casual Leave</span>
                  <span className="font-semibold">{employeeData.casualLeave} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sick Leave</span>
                  <span className="font-semibold">{employeeData.sickLeave} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Earned Leave</span>
                  <span className="font-semibold">{employeeData.earnedLeave} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maternity Leave</span>
                  <span className="font-semibold">{employeeData.maternityLeave} days</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total Leave Days</span>
                  <span>{employeeData.totalLeaveDays} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overtime Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Overtime Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Overtime Hours</label>
              <p className="text-lg font-semibold">{employeeData.overtimeHours} hours</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Rate per Hour</label>
              <p className="text-lg font-semibold">৳{employeeData.overtimeRate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Total Overtime</label>
              <p className="text-lg font-semibold text-green-600">৳{employeeData.overtimeAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Payment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-green-600 mb-3">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Salary</span>
                  <span className="font-semibold">৳{employeeData.grossSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime</span>
                  <span className="font-semibold">৳{employeeData.overtimeAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Total Deductions</span>
                  <span>-৳{employeeData.totalDeductions.toLocaleString()}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-xl font-bold text-green-600">
                  <span>Net Salary</span>
                  <span>৳{employeeData.netSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-3">Payment Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Amount</span>
                  <span className="font-semibold text-green-600">৳{employeeData.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Amount</span>
                  <span className="font-semibold text-orange-600">৳{employeeData.remainingAmount.toLocaleString()}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-semibold px-2 py-1 rounded text-xs ${
                    employeeData.remainingAmount === 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employeeData.remainingAmount === 0 ? 'Fully Paid' : 'Partially Paid'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Bank Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Bank Name</label>
              <p className="text-lg font-semibold">{employeeData.bankName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Account Number</label>
              <p className="text-lg font-semibold">{employeeData.accountNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Branch</label>
              <p className="text-lg font-semibold">{employeeData.branchName}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
          >
            Print Payslip
          </button>
          <button
            onClick={() => window.close()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
