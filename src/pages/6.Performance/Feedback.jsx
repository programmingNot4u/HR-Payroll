import { useState } from 'react'

export default function Feedback() {
  const [feedbackItems] = useState([
    {
      id: 1,
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      position: 'Senior Customer Support Manager',
      department: 'Customer Support',
      feedbackType: 'Peer Feedback',
      submittedBy: 'Mike Chen',
      submittedByPosition: 'HR Director',
      submittedDate: '2024-06-25',
      status: 'Reviewed',
      rating: 4.5,
      category: 'Leadership',
      feedback: 'Sarah demonstrates exceptional leadership qualities in managing the customer support team. Her ability to motivate team members and handle difficult situations is commendable. She consistently goes above and beyond to ensure customer satisfaction and team success.',
      strengths: [
        'Strong team leadership',
        'Excellent problem-solving skills',
        'High level of empathy',
        'Consistent performance'
      ],
      areasForImprovement: [
        'Could delegate more effectively',
        'Opportunity to enhance cross-departmental collaboration'
      ],
      actionItems: [
        'Schedule leadership development workshop',
        'Implement team delegation framework',
        'Establish cross-departmental communication channels'
      ],
      followUpDate: '2024-07-15',
      priority: 'High'
    },
    {
      id: 2,
      employeeName: 'David Thompson',
      employeeId: 'EMP002',
      position: 'Project Manager',
      department: 'Project Management',
      feedbackType: 'Manager Feedback',
      submittedBy: 'Emily Watson',
      submittedByPosition: 'Operations Director',
      submittedDate: '2024-06-20',
      status: 'Pending Review',
      rating: 3.8,
      category: 'Project Management',
      feedback: 'David shows strong technical capabilities in project management and is reliable in delivering projects on time. However, there are opportunities for improvement in communication and stakeholder management. His technical skills are solid, but soft skills could be enhanced.',
      strengths: [
        'Strong technical knowledge',
        'Reliable project delivery',
        'Good problem-solving abilities',
        'Consistent attendance'
      ],
      areasForImprovement: [
        'Communication skills need enhancement',
        'Stakeholder management could improve',
        'Risk identification and mitigation'
      ],
      actionItems: [
        'Enroll in communication skills workshop',
        'Attend stakeholder management training',
        'Implement risk assessment framework'
      ],
      followUpDate: '2024-07-10',
      priority: 'Medium'
    },
    {
      id: 3,
      employeeName: 'Lisa Rodriguez',
      employeeId: 'EMP003',
      position: 'Training Specialist',
      department: 'Training & Development',
      feedbackType: '360 Feedback',
      submittedBy: 'Multiple Sources',
      submittedByPosition: 'Various',
      submittedDate: '2024-06-18',
      status: 'Completed',
      rating: 4.6,
      category: 'Training & Development',
      feedback: 'Lisa is an outstanding training professional who consistently exceeds expectations. Her innovative approach to learning design and exceptional delivery skills make her a valuable asset. She shows great potential for leadership roles and is highly respected by her peers.',
      strengths: [
        'Exceptional training delivery',
        'Innovative learning design',
        'Strong interpersonal skills',
        'High level of creativity'
      ],
      areasForImprovement: [
        'Could enhance technical training capabilities',
        'Strategic planning skills development'
      ],
      actionItems: [
        'Complete technical training certification',
        'Attend strategic planning workshop',
        'Lead innovation initiative for Q3'
      ],
      followUpDate: '2024-07-20',
      priority: 'Low'
    },
    {
      id: 4,
      employeeName: 'Mike Chen',
      employeeId: 'EMP004',
      position: 'HR Director',
      department: 'Human Resources',
      feedbackType: 'Executive Feedback',
      submittedBy: 'CEO',
      submittedByPosition: 'Chief Executive Officer',
      submittedDate: '2024-06-15',
      status: 'Reviewed',
      rating: 4.3,
      category: 'Strategic Leadership',
      feedback: 'Mike has demonstrated excellent leadership in the HR function and has been instrumental in driving positive organizational change. His strategic thinking and team management skills are exemplary. He shows strong business acumen and is well-positioned for future growth.',
      strengths: [
        'Strategic HR leadership',
        'Excellent team management',
        'Strong business acumen',
        'Proactive approach'
      ],
      areasForImprovement: [
        'Data analytics capabilities',
        'Succession planning framework'
      ],
      actionItems: [
        'Implement HR analytics dashboard',
        'Develop succession planning framework',
        'Lead culture transformation initiative'
      ],
      followUpDate: '2024-07-25',
      priority: 'Medium'
    },
    {
      id: 5,
      employeeName: 'Emily Watson',
      employeeId: 'EMP005',
      position: 'Sales Manager',
      department: 'Sales',
      feedbackType: 'Customer Feedback',
      submittedBy: 'Customer Survey',
      submittedByPosition: 'External',
      submittedDate: '2024-06-10',
      status: 'In Progress',
      rating: 4.1,
      category: 'Customer Service',
      feedback: 'Emily has shown strong leadership in managing the sales team and has consistently achieved good results. Her customer relationship skills and initiative are commendable. Customers appreciate her responsiveness and problem-solving approach.',
      strengths: [
        'Strong customer relationships',
        'Excellent sales leadership',
        'High level of initiative',
        'Good problem-solving'
      ],
      areasForImprovement: [
        'Sales forecasting accuracy',
        'Team performance metrics',
        'Process documentation'
      ],
      actionItems: [
        'Improve forecasting accuracy by 20%',
        'Implement performance tracking system',
        'Document sales processes'
      ],
      followUpDate: '2024-07-05',
      priority: 'High'
    },
    {
      id: 6,
      employeeName: 'Robert Wilson',
      employeeId: 'EMP006',
      position: 'Software Developer',
      department: 'Engineering',
      feedbackType: 'Peer Feedback',
      submittedBy: 'Team Members',
      submittedByPosition: 'Development Team',
      submittedDate: '2024-06-05',
      status: 'Pending Action',
      rating: 3.9,
      category: 'Technical Skills',
      feedback: 'Robert is a skilled developer with strong technical capabilities. He contributes well to team projects and is reliable in meeting deadlines. There are opportunities for improvement in code documentation and knowledge sharing with junior developers.',
      strengths: [
        'Strong technical skills',
        'Reliable project delivery',
        'Good problem-solving',
        'Team collaboration'
      ],
      areasForImprovement: [
        'Code documentation',
        'Knowledge sharing',
        'Code review participation'
      ],
      actionItems: [
        'Improve code documentation standards',
        'Mentor junior developers',
        'Participate actively in code reviews'
      ],
      followUpDate: '2024-07-12',
      priority: 'Medium'
    }
  ])

  const [selectedType, setSelectedType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const feedbackTypes = ['All', 'Peer Feedback', 'Manager Feedback', '360 Feedback', 'Executive Feedback', 'Customer Feedback']
  const statuses = ['All', 'Completed', 'Reviewed', 'Pending Review', 'In Progress', 'Pending Action']
  const categories = ['All', 'Leadership', 'Project Management', 'Training & Development', 'Strategic Leadership', 'Customer Service', 'Technical Skills']
  const priorities = ['All', 'High', 'Medium', 'Low']

  const filteredFeedback = feedbackItems.filter(feedback => {
    const matchesType = selectedType === 'All' || feedback.feedbackType === selectedType
    const matchesStatus = selectedStatus === 'All' || feedback.status === selectedStatus
    const matchesCategory = selectedCategory === 'All' || feedback.category === selectedCategory
    const matchesPriority = selectedPriority === 'All' || feedback.priority === selectedPriority
    const matchesSearch = feedback.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         feedback.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesStatus && matchesCategory && matchesPriority && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100'
      case 'Reviewed': return 'text-blue-600 bg-blue-100'
      case 'Pending Review': return 'text-yellow-600 bg-yellow-100'
      case 'In Progress': return 'text-orange-600 bg-orange-100'
      case 'Pending Action': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100'
    if (rating >= 4.0) return 'text-blue-600 bg-blue-100'
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Leadership': return 'text-purple-600 bg-purple-100'
      case 'Project Management': return 'text-indigo-600 bg-indigo-100'
      case 'Training & Development': return 'text-blue-600 bg-blue-100'
      case 'Strategic Leadership': return 'text-green-600 bg-green-100'
      case 'Customer Service': return 'text-orange-600 bg-orange-100'
      case 'Technical Skills': return 'text-teal-600 bg-teal-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employee Feedback</h1>
          <p className="text-gray-600 mt-1">Manage and track employee feedback and development opportunities</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          + Submit Feedback
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-semibold text-gray-900">{feedbackItems.length}</p>
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
                {feedbackItems.filter(f => f.status === 'Completed').length}
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
              <p className="text-sm font-medium text-gray-600">Pending Action</p>
              <p className="text-2xl font-semibold text-gray-900">
                {feedbackItems.filter(f => f.status === 'Pending Action' || f.status === 'In Progress').length}
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
                {(feedbackItems.reduce((sum, f) => sum + f.rating, 0) / feedbackItems.length).toFixed(1)}
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
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {feedbackTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
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
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map(feedback => (
          <div key={feedback.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{feedback.employeeName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                    {feedback.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(feedback.rating)}`}>
                    {feedback.rating}/5.0
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>
                    {feedback.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(feedback.priority)}`}>
                    {feedback.priority}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-sm font-medium text-gray-900">{feedback.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Feedback Type</p>
                    <p className="text-sm font-medium text-gray-900">{feedback.feedbackType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted By</p>
                    <p className="text-sm font-medium text-gray-900">{feedback.submittedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted Date</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(feedback.submittedDate).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback Summary</h4>
                  <p className="text-sm text-gray-600">{feedback.feedback}</p>
                </div>

                {/* Strengths & Areas for Improvement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {feedback.strengths.map((strength, index) => (
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
                      {feedback.areasForImprovement.map((area, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Action Items</h4>
                  <ul className="space-y-1">
                    {feedback.actionItems.map((action, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Follow-up Date: {new Date(feedback.followUpDate).toLocaleDateString('en-GB')}</span>
                  <span>Department: {feedback.department}</span>
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

      {filteredFeedback.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

