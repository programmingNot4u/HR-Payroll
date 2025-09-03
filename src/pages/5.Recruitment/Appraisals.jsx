import { useState } from 'react'

export default function Appraisals() {
  const [appraisals] = useState([
    {
      id: 1,
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      position: 'Senior Customer Support Manager',
      department: 'Customer Support',
      reviewPeriod: 'Q2 2024',
      reviewDate: '2024-06-30',
      reviewer: 'Mike Chen',
      reviewerPosition: 'HR Director',
      status: 'Completed',
      overallRating: 4.2,
      ratings: {
        'Job Knowledge': 4.5,
        'Quality of Work': 4.3,
        'Communication': 4.0,
        'Teamwork': 4.4,
        'Initiative': 4.1,
        'Problem Solving': 4.2,
        'Leadership': 4.3,
        'Attendance': 4.5
      },
      strengths: [
        'Excellent customer service skills',
        'Strong team leadership abilities',
        'Consistent high-quality work output',
        'Proactive problem-solving approach'
      ],
      areasForImprovement: [
        'Could improve time management for complex projects',
        'Opportunity to enhance cross-departmental communication'
      ],
      goals: [
        'Complete advanced leadership training by Q3',
        'Implement new customer feedback system by Q4',
        'Reduce customer response time by 15%'
      ],
      comments: 'Sarah has demonstrated exceptional leadership in managing the customer support team. Her ability to handle difficult situations and maintain team morale is commendable. With continued focus on time management, she has the potential for senior leadership roles.'
    },
    {
      id: 2,
      employeeName: 'David Thompson',
      employeeId: 'EMP002',
      position: 'Project Manager',
      department: 'Project Management',
      reviewPeriod: 'Q2 2024',
      reviewDate: '2024-06-28',
      reviewer: 'Emily Watson',
      reviewerPosition: 'Operations Director',
      status: 'In Progress',
      overallRating: 3.8,
      ratings: {
        'Job Knowledge': 4.0,
        'Quality of Work': 3.8,
        'Communication': 3.5,
        'Teamwork': 4.2,
        'Initiative': 3.9,
        'Problem Solving': 4.1,
        'Leadership': 3.7,
        'Attendance': 4.0
      },
      strengths: [
        'Strong technical project management skills',
        'Good team collaboration',
        'Reliable attendance and punctuality',
        'Effective problem-solving abilities'
      ],
      areasForImprovement: [
        'Communication skills need enhancement',
        'Could be more proactive in identifying project risks',
        'Leadership development opportunities'
      ],
      goals: [
        'Complete communication skills workshop by Q3',
        'Lead at least 2 major projects independently',
        'Develop mentoring relationship with junior PMs'
      ],
      comments: 'David shows strong technical capabilities and is a reliable team member. His project management skills are solid, but there are opportunities for growth in communication and leadership areas. With proper development support, he can advance to senior project management roles.'
    },
    {
      id: 3,
      employeeName: 'Lisa Rodriguez',
      employeeId: 'EMP003',
      position: 'Training Specialist',
      department: 'Training & Development',
      reviewPeriod: 'Q2 2024',
      reviewDate: '2024-06-25',
      reviewer: 'Robert Wilson',
      reviewerPosition: 'Learning Manager',
      status: 'Completed',
      overallRating: 4.5,
      ratings: {
        'Job Knowledge': 4.6,
        'Quality of Work': 4.5,
        'Communication': 4.7,
        'Teamwork': 4.4,
        'Initiative': 4.6,
        'Problem Solving': 4.3,
        'Leadership': 4.2,
        'Attendance': 4.5
      },
      strengths: [
        'Exceptional training delivery skills',
        'Innovative approach to learning design',
        'Strong interpersonal communication',
        'High level of initiative and creativity'
      ],
      areasForImprovement: [
        'Could enhance technical training capabilities',
        'Opportunity to develop strategic planning skills'
      ],
      goals: [
        'Complete technical training certification by Q4',
        'Lead strategic learning initiative for Q1 2025',
        'Mentor new training specialists'
      ],
      comments: 'Lisa is an outstanding training professional who consistently exceeds expectations. Her innovative approach to learning design and exceptional delivery skills make her a valuable asset to the organization. She shows great potential for leadership roles in the training department.'
    },
    {
      id: 4,
      employeeName: 'Mike Chen',
      employeeId: 'EMP004',
      position: 'HR Director',
      department: 'Human Resources',
      reviewPeriod: 'Q2 2024',
      reviewDate: '2024-06-20',
      reviewer: 'CEO',
      reviewerPosition: 'Chief Executive Officer',
      status: 'Completed',
      overallRating: 4.3,
      ratings: {
        'Job Knowledge': 4.4,
        'Quality of Work': 4.3,
        'Communication': 4.2,
        'Teamwork': 4.5,
        'Initiative': 4.4,
        'Problem Solving': 4.3,
        'Leadership': 4.5,
        'Attendance': 4.4
      },
      strengths: [
        'Strong strategic HR leadership',
        'Excellent team management skills',
        'Proactive approach to HR challenges',
        'Strong business acumen'
      ],
      areasForImprovement: [
        'Could enhance data analytics capabilities',
        'Opportunity to strengthen succession planning'
      ],
      goals: [
        'Implement advanced HR analytics dashboard by Q4',
        'Develop comprehensive succession planning framework',
        'Lead organizational culture transformation initiative'
      ],
      comments: 'Mike has demonstrated excellent leadership in the HR function and has been instrumental in driving positive organizational change. His strategic thinking and team management skills are exemplary. With continued focus on data analytics and succession planning, he can further enhance his contribution to the organization.'
    },
    {
      id: 5,
      employeeName: 'Emily Watson',
      employeeId: 'EMP005',
      position: 'Sales Manager',
      department: 'Sales',
      reviewPeriod: 'Q2 2024',
      reviewDate: '2024-06-15',
      reviewer: 'Sales Director',
      reviewerPosition: 'VP of Sales',
      status: 'Pending Review',
      overallRating: 4.1,
      ratings: {
        'Job Knowledge': 4.2,
        'Quality of Work': 4.0,
        'Communication': 4.3,
        'Teamwork': 4.1,
        'Initiative': 4.4,
        'Problem Solving': 4.0,
        'Leadership': 4.2,
        'Attendance': 4.1
      },
      strengths: [
        'Strong sales leadership and coaching',
        'Excellent customer relationship skills',
        'High level of initiative and drive',
        'Good team collaboration'
      ],
      areasForImprovement: [
        'Could improve sales forecasting accuracy',
        'Opportunity to enhance team performance metrics'
      ],
      goals: [
        'Improve sales forecasting accuracy by 20%',
        'Implement new team performance tracking system',
        'Achieve 110% of team sales target for Q3'
      ],
      comments: 'Emily has shown strong leadership in managing the sales team and has consistently achieved good results. Her customer relationship skills and initiative are commendable. With focus on forecasting and performance metrics, she can further enhance her team\'s effectiveness.'
    }
  ])

  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedRating, setSelectedRating] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const statuses = ['All', 'Completed', 'In Progress', 'Pending Review', 'Overdue']
  const departments = ['All', 'Customer Support', 'Project Management', 'Training & Development', 'Human Resources', 'Sales']
  const ratings = ['All', '4.5+', '4.0-4.4', '3.5-3.9', 'Below 3.5']

  const filteredAppraisals = appraisals.filter(appraisal => {
    const matchesStatus = selectedStatus === 'All' || appraisal.status === selectedStatus
    const matchesDepartment = selectedDepartment === 'All' || appraisal.department === selectedDepartment
    const matchesRating = selectedRating === 'All' || 
      (selectedRating === '4.5+' && appraisal.overallRating >= 4.5) ||
      (selectedRating === '4.0-4.4' && appraisal.overallRating >= 4.0 && appraisal.overallRating < 4.5) ||
      (selectedRating === '3.5-3.9' && appraisal.overallRating >= 3.5 && appraisal.overallRating < 4.0) ||
      (selectedRating === 'Below 3.5' && appraisal.overallRating < 3.5)
    const matchesSearch = appraisal.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         appraisal.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appraisal.reviewer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesDepartment && matchesRating && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100'
      case 'In Progress': return 'text-blue-600 bg-blue-100'
      case 'Pending Review': return 'text-yellow-600 bg-yellow-100'
      case 'Overdue': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100'
    if (rating >= 4.0) return 'text-blue-600 bg-blue-100'
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Customer Support': return 'text-blue-600 bg-blue-100'
      case 'Project Management': return 'text-purple-600 bg-purple-100'
      case 'Training & Development': return 'text-indigo-600 bg-indigo-100'
      case 'Human Resources': return 'text-green-600 bg-green-100'
      case 'Sales': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employee Appraisals</h1>
          <p className="text-gray-600 mt-1">Manage and review employee performance evaluations</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          + New Appraisal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Appraisals</p>
              <p className="text-2xl font-semibold text-gray-900">{appraisals.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {appraisals.filter(a => a.status === 'Completed').length}
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
                {appraisals.filter(a => a.status === 'Pending Review' || a.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(appraisals.reduce((sum, a) => sum + a.overallRating, 0) / appraisals.length).toFixed(1)}
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
              placeholder="Search appraisals..."
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
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {ratings.map(rating => (
                <option key={rating} value={rating}>{rating}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appraisals List */}
      <div className="space-y-4">
        {filteredAppraisals.map(appraisal => (
          <div key={appraisal.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{appraisal.employeeName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appraisal.status)}`}>
                    {appraisal.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(appraisal.overallRating)}`}>
                    {appraisal.overallRating}/5.0
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(appraisal.department)}`}>
                    {appraisal.department}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-sm font-medium text-gray-900">{appraisal.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Review Period</p>
                    <p className="text-sm font-medium text-gray-900">{appraisal.reviewPeriod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reviewer</p>
                    <p className="text-sm font-medium text-gray-900">{appraisal.reviewer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Review Date</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(appraisal.reviewDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Ratings</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(appraisal.ratings).map(([category, rating]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{category}</span>
                        <span className="text-sm font-medium text-gray-900">{rating}/5</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Areas for Improvement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {appraisal.strengths.map((strength, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {appraisal.areasForImprovement.map((area, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Goals */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Development Goals</h4>
                  <ul className="space-y-1">
                    {appraisal.goals.map((goal, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Comments */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Reviewer Comments</h4>
                  <p className="text-sm text-gray-600 italic">"{appraisal.comments}"</p>
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

      {filteredAppraisals.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appraisals found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

