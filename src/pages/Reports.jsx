import { useState } from 'react'

const reportTypes = [
  {
    id: 'attendance',
    title: 'Monthly Attendance Report',
    description: 'Generate attendance reports by month and department',
    icon: '📊',
    fields: ['Month', 'Department', 'Employee Type']
  },
  {
    id: 'leave',
    title: 'Monthly Leave Report',
    description: 'View leave statistics and patterns by month',
    icon: '📅',
    fields: ['Month', 'Leave Type', 'Department']
  },
  {
    id: 'payroll',
    title: 'Monthly Payroll Report',
    description: 'Generate comprehensive payroll reports',
    icon: '💰',
    fields: ['Month', 'Department', 'Payment Status']
  }
]

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [filters, setFilters] = useState({})
  const [generatedReport, setGeneratedReport] = useState(null)

  const handleGenerateReport = () => {
    // Simulate report generation
    setGeneratedReport({
      type: selectedReport,
      filters,
      data: `Sample ${selectedReport} data for ${filters.month || 'August'} 2024`,
      generatedAt: new Date().toLocaleString()
    })
  }

  const resetReport = () => {
    setSelectedReport(null)
    setFilters({})
    setGeneratedReport(null)
  }

  if (selectedReport && !generatedReport) {
    const report = reportTypes.find(r => r.id === selectedReport)
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={resetReport}
            className="text-orange-600 hover:text-orange-700"
          >
            ← Back to Reports
          </button>
          <div>
            <h1 className="text-2xl font-semibold">{report.title}</h1>
            <p className="text-sm text-gray-500">{report.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Report Filters</h2>
            <div className="space-y-4">
              {report.fields.map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field}
                  </label>
                  <select
                    value={filters[field.toLowerCase().replace(' ', '')] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      [field.toLowerCase().replace(' ', '')]: e.target.value
                    }))}
                    className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select {field}</option>
                    {field === 'Month' && (
                      <>
                        <option value="Jan">January</option>
                        <option value="Feb">February</option>
                        <option value="Mar">March</option>
                        <option value="Apr">April</option>
                        <option value="May">May</option>
                        <option value="Jun">June</option>
                        <option value="Jul">July</option>
                        <option value="Aug">August</option>
                        <option value="Sep">September</option>
                        <option value="Oct">October</option>
                        <option value="Nov">November</option>
                        <option value="Dec">December</option>
                      </>
                    )}
                    {field === 'Department' && (
                      <>
                        <option value="cutting">Cutting</option>
                        <option value="sewing">Sewing</option>
                        <option value="finishing">Finishing</option>
                        <option value="quality">Quality Control</option>
                        <option value="management">Management</option>
                      </>
                    )}
                    {field === 'Employee Type' && (
                      <>
                        <option value="worker">Worker</option>
                        <option value="staff">Staff</option>
                        <option value="management">Management</option>
                      </>
                    )}
                    {field === 'Leave Type' && (
                      <>
                        <option value="casual">Casual Leave</option>
                        <option value="sick">Sick Leave</option>
                        <option value="maternity">Maternity Leave</option>
                        <option value="earned">Earned Leave</option>
                      </>
                    )}
                    {field === 'Payment Status' && (
                      <>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                      </>
                    )}
                  </select>
                </div>
              ))}
            </div>
            <button
              onClick={handleGenerateReport}
              className="mt-6 w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
            >
              Generate Report
            </button>
          </div>

          <div className="rounded border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Report Preview</h2>
            <div className="text-sm text-gray-500">
              <p>Select filters and click "Generate Report" to create your report.</p>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">Available Data:</h3>
                <ul className="space-y-1 text-xs">
                  <li>• Employee attendance records</li>
                  <li>• Leave applications and approvals</li>
                  <li>• Payroll calculations and payments</li>
                  <li>• Department-wise statistics</li>
                  <li>• Monthly trends and comparisons</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (generatedReport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={resetReport}
              className="text-orange-600 hover:text-orange-700"
            >
              ← Back to Reports
            </button>
            <div>
              <h1 className="text-2xl font-semibold">Generated Report</h1>
              <p className="text-sm text-gray-500">Generated on {generatedReport.generatedAt}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Export PDF
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Export Excel
            </button>
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Report Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 rounded">
                <div className="text-sm text-gray-500">Total Records</div>
                <div className="text-2xl font-semibold text-orange-600">1,245</div>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-2xl font-semibold text-blue-600">৳482,300</div>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <div className="text-sm text-gray-500">Status</div>
                <div className="text-2xl font-semibold text-green-600">Complete</div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Report Data</h3>
            <div className="bg-gray-50 p-4 rounded text-sm">
              <p>{generatedReport.data}</p>
              <p className="mt-2 text-gray-500">
                This is a sample report. In a real application, this would contain actual data 
                based on the selected filters and report type.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-gray-500">Generate and view various HR reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map(report => (
          <div
            key={report.id}
            className="rounded border border-gray-200 bg-white p-6 hover:border-orange-300 transition-colors cursor-pointer"
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="text-3xl mb-4">{report.icon}</div>
            <h2 className="text-lg font-medium mb-2">{report.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
            <div className="text-xs text-gray-500">
              <div className="font-medium mb-1">Available Filters:</div>
              <div className="space-y-1">
                {report.fields.map(field => (
                  <div key={field} className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                    {field}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
