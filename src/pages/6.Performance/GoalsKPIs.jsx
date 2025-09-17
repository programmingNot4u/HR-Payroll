import { useState } from 'react'

export default function GoalsKPIs() {
  const [goals] = useState([
    {
      id: 1,
      title: 'Increase Customer Satisfaction Score',
      description: 'Improve overall customer satisfaction from 85% to 92% through enhanced service quality and response times.',
      category: 'Customer Service',
      type: 'Performance Goal',
      target: '92%',
      current: '87%',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'In Progress',
      priority: 'High',
      owner: 'Sarah Johnson',
      department: 'Customer Support',
      milestones: [
        { id: 1, title: 'Q1 Target: 87%', completed: true, date: '2024-03-31' },
        { id: 2, title: 'Q2 Target: 89%', completed: true, date: '2024-06-30' },
        { id: 3, title: 'Q3 Target: 91%', completed: false, date: '2024-09-30' },
        { id: 4, title: 'Q4 Target: 92%', completed: false, date: '2024-12-31' }
      ]
    },
    {
      id: 2,
      title: 'Reduce Employee Turnover Rate',
      description: 'Decrease annual employee turnover from 15% to 10% through improved retention strategies and employee engagement.',
      category: 'HR',
      type: 'Retention Goal',
      target: '10%',
      current: '13%',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'In Progress',
      priority: 'Medium',
      owner: 'Mike Chen',
      department: 'Human Resources',
      milestones: [
        { id: 1, title: 'Q1 Target: 14%', completed: true, date: '2024-03-31' },
        { id: 2, title: 'Q2 Target: 13%', completed: true, date: '2024-06-30' },
        { id: 3, title: 'Q3 Target: 11%', completed: false, date: '2024-09-30' },
        { id: 4, title: 'Q4 Target: 10%', completed: false, date: '2024-12-31' }
      ]
    },
    {
      id: 3,
      title: 'Increase Sales Revenue',
      description: 'Achieve 25% growth in sales revenue compared to previous year through market expansion and new product launches.',
      category: 'Sales',
      type: 'Revenue Goal',
      target: '$2.5M',
      current: '$1.8M',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'On Track',
      priority: 'High',
      owner: 'Emily Watson',
      department: 'Sales',
      milestones: [
        { id: 1, title: 'Q1 Target: $1.6M', completed: true, date: '2024-03-31' },
        { id: 2, title: 'Q2 Target: $1.8M', completed: true, date: '2024-06-30' },
        { id: 3, title: 'Q3 Target: $2.1M', completed: false, date: '2024-09-30' },
        { id: 4, title: 'Q4 Target: $2.5M', completed: false, date: '2024-12-31' }
      ]
    },
    {
      id: 4,
      title: 'Improve Project Delivery Time',
      description: 'Reduce average project delivery time by 20% through process optimization and resource allocation improvements.',
      category: 'Operations',
      type: 'Efficiency Goal',
      target: '60 days',
      current: '72 days',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Behind Schedule',
      priority: 'Medium',
      owner: 'David Thompson',
      department: 'Project Management',
      milestones: [
        { id: 1, title: 'Q1 Target: 70 days', completed: true, date: '2024-03-31' },
        { id: 2, title: 'Q2 Target: 68 days', completed: false, date: '2024-06-30' },
        { id: 3, title: 'Q3 Target: 65 days', completed: false, date: '2024-09-30' },
        { id: 4, title: 'Q4 Target: 60 days', completed: false, date: '2024-12-31' }
      ]
    },
    {
      id: 5,
      title: 'Enhance Employee Training Completion',
      description: 'Achieve 95% completion rate for mandatory training programs across all departments.',
      category: 'Learning',
      type: 'Development Goal',
      target: '95%',
      current: '88%',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'In Progress',
      priority: 'Low',
      owner: 'Lisa Rodriguez',
      department: 'Training & Development',
      milestones: [
        { id: 1, title: 'Q1 Target: 88%', completed: true, date: '2024-03-31' },
        { id: 2, title: 'Q2 Target: 90%', completed: true, date: '2024-06-30' },
        { id: 3, title: 'Q3 Target: 93%', completed: false, date: '2024-09-30' },
        { id: 4, title: 'Q4 Target: 95%', completed: false, date: '2024-12-31' }
      ]
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', 'Customer Service', 'HR', 'Sales', 'Operations', 'Learning']
  const statuses = ['All', 'In Progress', 'On Track', 'Behind Schedule', 'Completed', 'At Risk']
  const priorities = ['All', 'High', 'Medium', 'Low']

  const filteredGoals = goals.filter(goal => {
    const matchesCategory = selectedCategory === 'All' || goal.category === selectedCategory
    const matchesStatus = selectedStatus === 'All' || goal.status === selectedStatus
    const matchesPriority = selectedPriority === 'All' || goal.priority === selectedPriority
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.owner.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesStatus && matchesPriority && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-blue-600 bg-blue-100'
      case 'On Track': return 'text-green-600 bg-green-100'
      case 'Behind Schedule': return 'text-orange-600 bg-orange-100'
      case 'Completed': return 'text-green-600 bg-green-100'
      case 'At Risk': return 'text-red-600 bg-red-100'
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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Customer Service': return 'text-blue-600 bg-blue-100'
      case 'HR': return 'text-purple-600 bg-purple-100'
      case 'Sales': return 'text-green-600 bg-green-100'
      case 'Operations': return 'text-orange-600 bg-orange-100'
      case 'Learning': return 'text-indigo-600 bg-indigo-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const calculateProgress = (current, target) => {
    if (typeof current === 'string' && typeof target === 'string') {
      const currentNum = parseFloat(current.replace(/[^0-9.]/g, ''))
      const targetNum = parseFloat(target.replace(/[^0-9.]/g, ''))
      return Math.min((currentNum / targetNum) * 100, 100)
    }
    return 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Goals & KPIs</h1>
          <p className="text-gray-600 mt-1">Track and manage organizational goals and key performance indicators</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          + Add Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-semibold text-gray-900">{goals.length}</p>
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
              <p className="text-sm font-medium text-gray-600">On Track</p>
              <p className="text-2xl font-semibold text-gray-900">
                {goals.filter(g => g.status === 'On Track').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">At Risk</p>
              <p className="text-2xl font-semibold text-gray-900">
                {goals.filter(g => g.status === 'At Risk' || g.status === 'Behind Schedule').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(goals.reduce((sum, g) => sum + calculateProgress(g.current, g.target), 0) / goals.length)}%
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
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
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

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map(goal => (
          <div key={goal.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                    {goal.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                    {goal.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{goal.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Target</p>
                    <p className="text-lg font-semibold text-gray-900">{goal.target}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current</p>
                    <p className="text-lg font-semibold text-gray-900">{goal.current}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <p className="text-sm font-medium text-gray-900">{goal.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900">{goal.department}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">
                      {Math.round(calculateProgress(goal.current, goal.target))}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${calculateProgress(goal.current, goal.target)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {goal.milestones.map(milestone => (
                      <div key={milestone.id} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={`text-xs ${milestone.completed ? 'text-green-600' : 'text-gray-500'}`}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Start: {(() => {
                    const formatDate = (dateString) => {
                      const date = new Date(dateString)
                      const day = String(date.getDate()).padStart(2, '0')
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const year = date.getFullYear()
                      return `${day}/${month}/${year}`
                    }
                    return formatDate(goal.startDate)
                  })()}</span>
                  <span>End: {(() => {
                    const formatDate = (dateString) => {
                      const date = new Date(dateString)
                      const day = String(date.getDate()).padStart(2, '0')
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const year = date.getFullYear()
                      return `${day}/${month}/${year}`
                    }
                    return formatDate(goal.endDate)
                  })()}</span>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No goals found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

