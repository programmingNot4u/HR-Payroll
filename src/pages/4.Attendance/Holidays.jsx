import { useState } from 'react'

export default function Holidays() {
  const [holidays] = useState([
    {
      id: 1,
      name: 'New Year\'s Day',
      date: '2024-01-01',
      type: 'Public Holiday',
      description: 'Celebration of the new year',
      isObserved: true,
      country: 'All Countries',
      duration: '1 day'
    },
    {
      id: 2,
      name: 'Christmas Day',
      date: '2024-12-25',
      type: 'Public Holiday',
      description: 'Christian celebration of the birth of Jesus Christ',
      isObserved: true,
      country: 'All Countries',
      duration: '1 day'
    },
    {
      id: 3,
      name: 'Independence Day',
      date: '2024-07-04',
      type: 'National Holiday',
      description: 'Celebration of national independence',
      isObserved: true,
      country: 'United States',
      duration: '1 day'
    },
    {
      id: 4,
      name: 'Thanksgiving Day',
      date: '2024-11-28',
      type: 'National Holiday',
      description: 'Day of giving thanks for the harvest',
      isObserved: true,
      country: 'United States',
      duration: '1 day'
    },
    {
      id: 5,
      name: 'Memorial Day',
      date: '2024-05-27',
      type: 'National Holiday',
      description: 'Day to remember and honor military personnel who died in service',
      isObserved: true,
      country: 'United States',
      duration: '1 day'
    },
    {
      id: 6,
      name: 'Labor Day',
      date: '2024-09-02',
      type: 'National Holiday',
      description: 'Celebration of the American labor movement',
      isObserved: true,
      country: 'United States',
      duration: '1 day'
    },
    {
      id: 7,
      name: 'Martin Luther King Jr. Day',
      date: '2024-01-15',
      type: 'National Holiday',
      description: 'Honoring the civil rights leader',
      isObserved: true,
      country: 'United States',
      duration: '1 day'
    },
    {
      id: 8,
      name: 'Presidents\' Day',
      date: '2024-02-19',
      type: 'National Holiday',
      description: 'Honoring past presidents of the United States',
      isObserved: true,
      country: 'United States',
      duration: '1 day'
    }
  ])

  const [selectedType, setSelectedType] = useState('All')
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const holidayTypes = ['All', 'Public Holiday', 'National Holiday', 'Company Holiday', 'Optional Holiday']
  const months = [
    'All', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const filteredHolidays = holidays.filter(holiday => {
    const matchesType = selectedType === 'All' || holiday.type === selectedType
    const matchesMonth = selectedMonth === 'All' || new Date(holiday.date).getMonth() === months.indexOf(selectedMonth) - 1
    const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         holiday.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesMonth && matchesSearch
  })

  const getTypeColor = (type) => {
    switch (type) {
      case 'Public Holiday': return 'text-blue-600 bg-blue-100'
      case 'National Holiday': return 'text-green-600 bg-green-100'
      case 'Company Holiday': return 'text-purple-600 bg-purple-100'
      case 'Optional Holiday': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getMonthColor = (date) => {
    const month = new Date(date).getMonth()
    const colors = [
      'text-blue-600 bg-blue-100', 'text-purple-600 bg-purple-100', 'text-green-600 bg-green-100',
      'text-yellow-600 bg-yellow-100', 'text-pink-600 bg-pink-100', 'text-indigo-600 bg-indigo-100',
      'text-red-600 bg-red-100', 'text-orange-600 bg-orange-100', 'text-teal-600 bg-teal-100',
      'text-gray-600 bg-gray-100', 'text-brown-600 bg-brown-100', 'text-cyan-600 bg-cyan-100'
    ]
    return colors[month]
  }

  const isUpcoming = (date) => {
    return new Date(date) > new Date()
  }

  const isToday = (date) => {
    const today = new Date()
    const holidayDate = new Date(date)
    return today.toDateString() === holidayDate.toDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Company Holidays</h1>
          <p className="text-gray-600 mt-1">View and manage company holiday calendar</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          + Add Holiday
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Holidays</p>
              <p className="text-2xl font-semibold text-gray-900">{holidays.length}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{holidays.filter(h => isUpcoming(h.date)).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {holidays.filter(h => {
                  const holidayDate = new Date(h.date)
                  const today = new Date()
                  return holidayDate.getMonth() === today.getMonth() && holidayDate.getFullYear() === today.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Next Holiday</p>
              <p className="text-lg font-semibold text-gray-900">
                {(() => {
                  const upcoming = holidays.filter(h => isUpcoming(h.date)).sort((a, b) => new Date(a.date) - new Date(b.date))
                  return upcoming.length > 0 ? upcoming[0].name : 'None'
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
              placeholder="Search holidays..."
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
              {holidayTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Holidays List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holiday</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHolidays.map(holiday => (
                <tr key={holiday.id} className={`hover:bg-gray-50 ${isToday(holiday.date) ? 'bg-orange-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{holiday.name}</div>
                      <div className="text-sm text-gray-500">{holiday.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMonthColor(holiday.date)}`}>
                        {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-sm text-gray-900">
                        {new Date(holiday.date).toLocaleDateString('en-US', { 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(holiday.type)}`}>
                      {holiday.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {holiday.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isToday(holiday.date) ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Today
                      </span>
                    ) : isUpcoming(holiday.date) ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Upcoming
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Past
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-orange-600 hover:text-orange-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredHolidays.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No holidays found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}
