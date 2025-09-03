import { useState } from 'react'

export default function Promotions() {
  const [promotions] = useState([
    {
      id: 1,
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      currentPosition: 'Senior Customer Support Manager',
      currentDepartment: 'Customer Support',
      proposedPosition: 'Customer Support Director',
      proposedDepartment: 'Customer Support',
      promotionType: 'Position Upgrade',
      requestDate: '2024-06-20',
      effectiveDate: '2024-08-01',
      status: 'Approved',
      priority: 'High',
      requestedBy: 'Mike Chen',
      approvedBy: 'CEO',
      currentSalary: '$75,000',
      proposedSalary: '$95,000',
      salaryIncrease: '26.7%',
      justification: 'Sarah has demonstrated exceptional leadership in managing the customer support team. She has consistently exceeded performance targets and shown strong strategic thinking. Her team has achieved 95% customer satisfaction rating and she has successfully implemented new processes that improved efficiency by 30%.',
      performanceMetrics: {
        'Customer Satisfaction': '95%',
        'Team Performance': '92%',
        'Process Efficiency': '30% improvement',
        'Leadership Score': '4.5/5.0'
      },
      requirements: [
        'Complete advanced leadership training',
        'Develop strategic plan for Q3-Q4 2024',
        'Mentor 2 junior managers'
      ],
      timeline: '3 months',
      riskAssessment: 'Low - Employee has proven track record and strong team support'
    },
    {
      id: 2,
      employeeName: 'David Thompson',
      employeeId: 'EMP002',
      currentPosition: 'Project Manager',
      currentDepartment: 'Project Management',
      proposedPosition: 'Senior Project Manager',
      proposedDepartment: 'Project Management',
      promotionType: 'Level Upgrade',
      requestDate: '2024-06-15',
      effectiveDate: '2024-07-15',
      status: 'Under Review',
      priority: 'Medium',
      requestedBy: 'Emily Watson',
      approvedBy: 'Pending',
      currentSalary: '$65,000',
      proposedSalary: '$75,000',
      salaryIncrease: '15.4%',
      justification: 'David has shown strong technical capabilities and has successfully delivered 8 major projects on time and within budget. He has improved project delivery efficiency and has been mentoring junior project managers. His technical skills are solid and he shows potential for senior leadership.',
      performanceMetrics: {
        'Project Delivery': '100% on time',
        'Budget Management': '98% within budget',
        'Team Leadership': '4.2/5.0',
        'Client Satisfaction': '4.5/5.0'
      },
      requirements: [
        'Complete communication skills workshop',
        'Lead 2 major projects independently',
        'Develop mentoring program for junior PMs'
      ],
      timeline: '2 months',
      riskAssessment: 'Medium - Good technical skills but communication needs improvement'
    },
    {
      id: 3,
      employeeName: 'Lisa Rodriguez',
      employeeId: 'EMP003',
      currentPosition: 'Training Specialist',
      currentDepartment: 'Training & Development',
      proposedPosition: 'Training Manager',
      proposedDepartment: 'Training & Development',
      promotionType: 'Position Upgrade',
      requestDate: '2024-06-10',
      effectiveDate: '2024-09-01',
      status: 'Approved',
      priority: 'Medium',
      requestedBy: 'Robert Wilson',
      approvedBy: 'HR Director',
      currentSalary: '$60,000',
      proposedSalary: '$75,000',
      salaryIncrease: '25.0%',
      justification: 'Lisa is an outstanding training professional who consistently exceeds expectations. Her innovative approach to learning design and exceptional delivery skills make her a valuable asset. She has successfully designed and delivered 15+ training programs with 98% participant satisfaction.',
      performanceMetrics: {
        'Training Satisfaction': '98%',
        'Program Completion': '95%',
        'Innovation Score': '4.8/5.0',
        'Leadership Potential': '4.6/5.0'
      },
      requirements: [
        'Complete technical training certification',
        'Lead strategic learning initiative',
        'Mentor new training specialists'
      ],
      timeline: '3 months',
      riskAssessment: 'Low - Exceptional performer with strong leadership potential'
    },
    {
      id: 4,
      employeeName: 'Mike Chen',
      employeeId: 'EMP004',
      currentPosition: 'HR Director',
      currentDepartment: 'Human Resources',
      proposedPosition: 'VP of Human Resources',
      proposedDepartment: 'Human Resources',
      promotionType: 'Executive Promotion',
      requestDate: '2024-06-05',
      effectiveDate: '2024-10-01',
      status: 'Under Review',
      priority: 'High',
      requestedBy: 'CEO',
      approvedBy: 'Board of Directors',
      currentSalary: '$120,000',
      proposedSalary: '$150,000',
      salaryIncrease: '25.0%',
      justification: 'Mike has demonstrated excellent leadership in the HR function and has been instrumental in driving positive organizational change. His strategic thinking and team management skills are exemplary. He has successfully implemented new HR systems and improved employee satisfaction by 25%.',
      performanceMetrics: {
        'Employee Satisfaction': '25% improvement',
        'HR System Implementation': '100% completion',
        'Strategic Leadership': '4.7/5.0',
        'Change Management': '4.5/5.0'
      },
      requirements: [
        'Develop comprehensive HR strategy for 2025',
        'Lead organizational culture transformation',
        'Implement advanced HR analytics'
      ],
      timeline: '4 months',
      riskAssessment: 'Low - Proven leader with strong strategic capabilities'
    },
    {
      id: 5,
      employeeName: 'Emily Watson',
      employeeId: 'EMP005',
      currentPosition: 'Sales Manager',
      currentDepartment: 'Sales',
      proposedPosition: 'Regional Sales Director',
      proposedDepartment: 'Sales',
      promotionType: 'Position Upgrade',
      requestDate: '2024-06-01',
      effectiveDate: '2024-08-15',
      status: 'Pending Approval',
      priority: 'Medium',
      requestedBy: 'Sales Director',
      approvedBy: 'Pending',
      currentSalary: '$70,000',
      proposedSalary: '$85,000',
      salaryIncrease: '21.4%',
      justification: 'Emily has shown strong leadership in managing the sales team and has consistently achieved 110% of sales targets. Her customer relationship skills and initiative are commendable. She has successfully expanded the customer base and improved team performance metrics.',
      performanceMetrics: {
        'Sales Target Achievement': '110%',
        'Customer Acquisition': '25% increase',
        'Team Performance': '4.3/5.0',
        'Customer Satisfaction': '4.6/5.0'
      },
      requirements: [
        'Develop regional sales strategy',
        'Improve forecasting accuracy by 20%',
        'Implement team performance tracking system'
      ],
      timeline: '2.5 months',
      riskAssessment: 'Medium - Good performance but needs strategic planning experience'
    },
    {
      id: 6,
      employeeName: 'Robert Wilson',
      employeeId: 'EMP006',
      currentPosition: 'Software Developer',
      currentDepartment: 'Engineering',
      proposedPosition: 'Senior Software Developer',
      proposedDepartment: 'Engineering',
      promotionType: 'Level Upgrade',
      requestDate: '2024-05-25',
      effectiveDate: '2024-07-01',
      status: 'Approved',
      priority: 'Low',
      requestedBy: 'Engineering Manager',
      approvedBy: 'CTO',
      currentSalary: '$80,000',
      proposedSalary: '$95,000',
      salaryIncrease: '18.8%',
      justification: 'Robert is a skilled developer with strong technical capabilities. He has contributed significantly to major projects and has been mentoring junior developers. His code quality and problem-solving skills are excellent, and he shows strong potential for technical leadership.',
      performanceMetrics: {
        'Code Quality': '4.5/5.0',
        'Project Contribution': 'High',
        'Mentoring': '4.2/5.0',
        'Problem Solving': '4.4/5.0'
      },
      requirements: [
        'Lead technical design for 2 major features',
        'Mentor 3 junior developers',
        'Improve code documentation standards'
      ],
      timeline: '1.5 months',
      riskAssessment: 'Low - Strong technical performer with good leadership potential'
    }
  ])

  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const statuses = ['All', 'Approved', 'Under Review', 'Pending Approval', 'Rejected', 'On Hold']
  const promotionTypes = ['All', 'Position Upgrade', 'Level Upgrade', 'Executive Promotion', 'Lateral Move']
  const priorities = ['All', 'High', 'Medium', 'Low']
  const departments = ['All', 'Customer Support', 'Project Management', 'Training & Development', 'Human Resources', 'Sales', 'Engineering']

  const filteredPromotions = promotions.filter(promotion => {
    const matchesStatus = selectedStatus === 'All' || promotion.status === selectedStatus
    const matchesType = selectedType === 'All' || promotion.promotionType === selectedType
    const matchesPriority = selectedPriority === 'All' || promotion.priority === selectedPriority
    const matchesDepartment = selectedDepartment === 'All' || promotion.currentDepartment === selectedDepartment
    const matchesSearch = promotion.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         promotion.currentPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.proposedPosition.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesType && matchesPriority && matchesDepartment && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100'
      case 'Under Review': return 'text-blue-600 bg-blue-100'
      case 'Pending Approval': return 'text-yellow-600 bg-yellow-100'
      case 'Rejected': return 'text-red-600 bg-red-100'
      case 'On Hold': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Position Upgrade': return 'text-purple-600 bg-purple-100'
      case 'Level Upgrade': return 'text-indigo-600 bg-indigo-100'
      case 'Executive Promotion': return 'text-green-600 bg-green-100'
      case 'Lateral Move': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Customer Support': return 'text-blue-600 bg-blue-100'
      case 'Project Management': return 'text-purple-600 bg-purple-100'
      case 'Training & Development': return 'text-indigo-600 bg-indigo-100'
      case 'Human Resources': return 'text-green-600 bg-green-100'
      case 'Sales': return 'text-orange-600 bg-orange-100'
      case 'Engineering': return 'text-teal-600 bg-teal-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employee Promotions</h1>
          <p className="text-gray-600 mt-1">Manage and track employee promotion requests and approvals</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          + Request Promotion
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{promotions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {promotions.filter(p => p.status === 'Approved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {promotions.filter(p => p.status === 'Pending Approval' || p.status === 'Under Review').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Increase</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(() => {
                  const increases = promotions.map(p => parseFloat(p.salaryIncrease.replace('%', '')))
                  return (increases.reduce((sum, inc) => sum + inc, 0) / increases.length).toFixed(1) + '%'
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {promotionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <div className="space-y-4">
        {filteredPromotions.map(promotion => (
          <div key={promotion.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{promotion.employeeName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promotion.status)}`}>
                    {promotion.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(promotion.priority)}`}>
                    {promotion.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(promotion.promotionType)}`}>
                    {promotion.promotionType}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(promotion.currentDepartment)}`}>
                    {promotion.currentDepartment}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Position</p>
                    <p className="text-sm font-medium text-gray-900">{promotion.currentPosition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Proposed Position</p>
                    <p className="text-sm font-medium text-gray-900">{promotion.proposedPosition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Requested By</p>
                    <p className="text-sm font-medium text-gray-900">{promotion.requestedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Request Date</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(promotion.requestDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Salary Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Salary</p>
                    <p className="text-sm font-medium text-gray-900">{promotion.currentSalary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Proposed Salary</p>
                    <p className="text-sm font-medium text-gray-900">{promotion.proposedSalary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Increase</p>
                    <p className="text-sm font-medium text-green-600">{promotion.salaryIncrease}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Effective Date</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(promotion.effectiveDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(promotion.performanceMetrics).map(([metric, value]) => (
                      <div key={metric} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{metric}</span>
                        <span className="text-sm font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Justification */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Justification</h4>
                  <p className="text-sm text-gray-600">{promotion.justification}</p>
                </div>

                {/* Requirements & Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements</h4>
                    <ul className="space-y-1">
                      {promotion.requirements.map((requirement, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Implementation Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Timeline:</span>
                        <span className="text-sm font-medium text-gray-900">{promotion.timeline}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Risk Assessment:</span>
                        <span className="text-sm font-medium text-gray-900">{promotion.riskAssessment}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Approved By: {promotion.approvedBy}</span>
                  <span>Timeline: {promotion.timeline}</span>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-blue-600 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-red-600 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No promotions found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

