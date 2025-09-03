import { useState } from 'react'

export default function TrainingSessions() {
  const [trainingSessions] = useState([
    {
      id: 1,
      title: 'Leadership Development Program',
      description: 'Comprehensive program designed to develop leadership skills for mid-level managers and team leads.',
      instructor: 'Dr. Sarah Johnson',
      date: '2024-02-15',
      time: '09:00 AM - 05:00 PM',
      duration: '8 hours',
      location: 'Training Room A',
      type: 'Leadership',
      category: 'Management',
      maxParticipants: 25,
      currentParticipants: 18,
      status: 'Upcoming',
      price: '$299',
      materials: ['Workbook', 'Online Resources', 'Certificate'],
      prerequisites: ['2+ years management experience', 'Basic communication skills'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Advanced Excel for Business',
      description: 'Master advanced Excel functions, pivot tables, and data analysis techniques for business applications.',
      instructor: 'Mike Chen',
      date: '2024-01-25',
      time: '01:00 PM - 05:00 PM',
      duration: '4 hours',
      location: 'Computer Lab B',
      type: 'Technical Skills',
      category: 'Software',
      maxParticipants: 20,
      currentParticipants: 20,
      status: 'Full',
      price: '$149',
      materials: ['Practice Files', 'Video Tutorials', 'Certificate'],
      prerequisites: ['Basic Excel knowledge', 'Laptop with Excel installed'],
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Customer Service Excellence',
      description: 'Learn proven techniques to deliver exceptional customer service and handle difficult situations.',
      instructor: 'Lisa Rodriguez',
      date: '2024-03-05',
      time: '10:00 AM - 03:00 PM',
      duration: '5 hours',
      location: 'Conference Room C',
      type: 'Soft Skills',
      category: 'Customer Service',
      maxParticipants: 30,
      currentParticipants: 15,
      status: 'Upcoming',
      price: '$199',
      materials: ['Role-play Scenarios', 'Best Practices Guide', 'Certificate'],
      prerequisites: ['Customer-facing role experience'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop'
    },
    {
      id: 4,
      title: 'Project Management Fundamentals',
      description: 'Essential project management principles, methodologies, and tools for successful project delivery.',
      instructor: 'David Thompson',
      date: '2024-01-30',
      time: '09:00 AM - 04:00 PM',
      duration: '7 hours',
      location: 'Training Room A',
      type: 'Project Management',
      category: 'Business',
      maxParticipants: 35,
      currentParticipants: 28,
      status: 'Upcoming',
      price: '$249',
      materials: ['Project Templates', 'Software Access', 'Certificate'],
      prerequisites: ['Basic organizational skills'],
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop'
    },
    {
      id: 5,
      title: 'Digital Marketing Strategies',
      description: 'Comprehensive overview of modern digital marketing channels, tools, and best practices.',
      instructor: 'Emily Watson',
      date: '2024-02-20',
      time: '02:00 PM - 06:00 PM',
      duration: '4 hours',
      location: 'Online (Zoom)',
      type: 'Digital Marketing',
      category: 'Marketing',
      maxParticipants: 50,
      currentParticipants: 45,
      status: 'Upcoming',
      price: '$179',
      materials: ['Digital Tools Access', 'Case Studies', 'Certificate'],
      prerequisites: ['Basic marketing knowledge', 'Stable internet connection'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop'
    },
    {
      id: 6,
      title: 'Workplace Safety & Compliance',
      description: 'Essential safety protocols, compliance requirements, and emergency procedures for workplace safety.',
      instructor: 'Robert Wilson',
      date: '2024-01-18',
      time: '09:00 AM - 12:00 PM',
      duration: '3 hours',
      location: 'Safety Training Center',
      type: 'Compliance',
      category: 'Safety',
      maxParticipants: 40,
      currentParticipants: 40,
      status: 'Completed',
      price: 'Free',
      materials: ['Safety Manual', 'Compliance Checklist', 'Certificate'],
      prerequisites: ['None - Required for all employees'],
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop'
    }
  ])

  const [selectedType, setSelectedType] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const trainingTypes = ['All', 'Leadership', 'Technical Skills', 'Soft Skills', 'Project Management', 'Digital Marketing', 'Compliance']
  const trainingCategories = ['All', 'Management', 'Software', 'Customer Service', 'Business', 'Marketing', 'Safety']
  const trainingStatuses = ['All', 'Upcoming', 'Full', 'Completed', 'Cancelled']

  const filteredSessions = trainingSessions.filter(session => {
    const matchesType = selectedType === 'All' || session.type === selectedType
    const matchesCategory = selectedCategory === 'All' || session.category === selectedCategory
    const matchesStatus = selectedStatus === 'All' || session.status === selectedStatus
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesCategory && matchesStatus && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'text-blue-600 bg-blue-100'
      case 'Full': return 'text-orange-600 bg-orange-100'
      case 'Completed': return 'text-green-600 bg-green-100'
      case 'Cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Leadership': return 'text-purple-600 bg-purple-100'
      case 'Technical Skills': return 'text-indigo-600 bg-indigo-100'
      case 'Soft Skills': return 'text-pink-600 bg-pink-100'
      case 'Project Management': return 'text-teal-600 bg-teal-100'
      case 'Digital Marketing': return 'text-blue-600 bg-blue-100'
      case 'Compliance': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Management': return 'text-purple-600 bg-purple-100'
      case 'Software': return 'text-indigo-600 bg-indigo-100'
      case 'Customer Service': return 'text-pink-600 bg-pink-100'
      case 'Business': return 'text-teal-600 bg-teal-100'
      case 'Marketing': return 'text-blue-600 bg-blue-100'
      case 'Safety': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Training Sessions</h1>
          <p className="text-gray-600 mt-1">Enhance your skills with our comprehensive training programs</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          + Create Training
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{trainingSessions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">
                {trainingSessions.filter(s => s.status === 'Upcoming').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-semibold text-gray-900">
                {trainingSessions.reduce((sum, s) => sum + s.currentParticipants, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {trainingSessions.filter(s => s.status === 'Completed').length}
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
              placeholder="Search training sessions..."
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
              {trainingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {trainingCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {trainingStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Training Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map(session => (
          <div key={session.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <img 
                src={session.image} 
                alt={session.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-1 bg-black bg-opacity-75 text-white rounded text-xs font-medium">
                  {session.price}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                  {session.type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(session.category)}`}>
                  {session.category}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{session.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{session.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{session.time} ({session.duration})</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{session.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{session.currentParticipants}</span> / {session.maxParticipants} participants
                </div>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                  {session.status === 'Upcoming' ? 'Register' : session.status === 'Full' ? 'Waitlist' : 'View Details'}
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No training sessions found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}
