import { useState } from 'react'

export default function Events() {
  const [events] = useState([
    {
      id: 1,
      title: 'Annual Company Meeting 2024',
      description: 'Join us for our annual company meeting where we will review the past year\'s achievements and discuss future plans.',
      date: '2024-02-15',
      time: '09:00 AM - 12:00 PM',
      location: 'Main Conference Hall',
      type: 'Company Meeting',
      attendees: 150,
      maxAttendees: 200,
      status: 'Upcoming',
      organizer: 'Executive Team',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Team Building Workshop',
      description: 'A fun and interactive workshop designed to strengthen team bonds and improve collaboration skills.',
      date: '2024-01-28',
      time: '02:00 PM - 05:00 PM',
      location: 'Training Room A',
      type: 'Workshop',
      attendees: 25,
      maxAttendees: 30,
      status: 'Upcoming',
      organizer: 'HR Department',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Product Launch Event',
      description: 'Celebrate the launch of our newest product line with demonstrations, presentations, and networking opportunities.',
      date: '2024-03-10',
      time: '06:00 PM - 09:00 PM',
      location: 'Grand Ballroom',
      type: 'Product Launch',
      attendees: 80,
      maxAttendees: 120,
      status: 'Upcoming',
      organizer: 'Marketing Team',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop'
    },
    {
      id: 4,
      title: 'Employee Recognition Ceremony',
      description: 'Annual ceremony to recognize and celebrate outstanding employee contributions and achievements.',
      date: '2024-01-20',
      time: '04:00 PM - 06:00 PM',
      location: 'Auditorium',
      type: 'Recognition',
      attendees: 200,
      maxAttendees: 250,
      status: 'Completed',
      organizer: 'HR Department',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop'
    },
    {
      id: 5,
      title: 'Industry Conference',
      description: 'Represent our company at the annual industry conference featuring keynote speakers and networking sessions.',
      date: '2024-04-05',
      time: '09:00 AM - 05:00 PM',
      location: 'Convention Center',
      type: 'Conference',
      attendees: 15,
      maxAttendees: 20,
      status: 'Upcoming',
      organizer: 'Business Development',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop'
    }
  ])

  const [selectedType, setSelectedType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const eventTypes = ['All', 'Company Meeting', 'Workshop', 'Product Launch', 'Recognition', 'Conference']
  const eventStatuses = ['All', 'Upcoming', 'Completed', 'Cancelled']

  const filteredEvents = events.filter(event => {
    const matchesType = selectedType === 'All' || event.type === selectedType
    const matchesStatus = selectedStatus === 'All' || event.status === selectedStatus
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'text-blue-600 bg-blue-100'
      case 'Completed': return 'text-green-600 bg-green-100'
      case 'Cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Company Meeting': return 'text-purple-600 bg-purple-100'
      case 'Workshop': return 'text-orange-600 bg-orange-100'
      case 'Product Launch': return 'text-indigo-600 bg-indigo-100'
      case 'Recognition': return 'text-pink-600 bg-pink-100'
      case 'Conference': return 'text-teal-600 bg-teal-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Company Events</h1>
          <p className="text-gray-600 mt-1">Discover and participate in company events and activities</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          + Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search events..."
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
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {eventStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                  {event.type}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{(() => {
                    const date = new Date(event.date)
                    const day = String(date.getDate()).padStart(2, '0')
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const year = date.getFullYear()
                    return `${day}/${month}/${year}`
                  })()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{event.attendees}</span> / {event.maxAttendees} attendees
                </div>
                <div className="text-sm text-gray-500">
                  By: {event.organizer}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                  {event.status === 'Upcoming' ? 'Register' : 'View Details'}
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

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}
