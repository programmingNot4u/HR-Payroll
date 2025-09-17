import { useState } from 'react'

export default function Holidays() {
  const [holidays, setHolidays] = useState([
    // FEBRUARY 2025
    {
      id: 1,
      name: 'Shab-e-Barat',
      date: '2025-02-14',
      fromDate: '2025-02-14',
      toDate: '2025-02-14',
      type: 'Religious Holiday',
      description: 'Night of Forgiveness - Islamic night of prayer and forgiveness',
      isObserved: true,
    },
    {
      id: 2,
      name: 'Language Martyrs Day (International Mother Language Day)',
      date: '2025-02-21',
      fromDate: '2025-02-21',
      toDate: '2025-02-21',
      type: 'National Holiday',
      description: 'Commemorating the martyrs of the Bengali Language Movement',
      isObserved: true,
    },
    
    // MARCH 2025
    {
      id: 3,
      name: 'Sheikh Mujibur Rahman\'s Birthday',
      date: '2025-03-17',
      fromDate: '2025-03-17',
      toDate: '2025-03-17',
      type: 'National Holiday',
      description: 'Birthday of the Father of the Nation',
      isObserved: true,
    },
    {
      id: 4,
      name: 'Shab-e-Qadr',
      date: '2025-03-25',
      fromDate: '2025-03-25',
      toDate: '2025-03-25',
      type: 'Religious Holiday',
      description: 'Night of Power - The holiest night in Ramadan',
      isObserved: true,
    },
    {
      id: 5,
      name: 'Independence Day',
      date: '2025-03-26',
      fromDate: '2025-03-26',
      toDate: '2025-03-26',
      type: 'National Holiday',
      description: 'Bangladesh Independence Day - Declaration of independence from Pakistan',
      isObserved: true,
    },
    {
      id: 6,
      name: 'Eid-ul-Fitr',
      date: '2025-03-30',
      fromDate: '2025-03-30',
      toDate: '2025-03-31',
      type: 'Religious Holiday',
      description: 'End of Ramadan - Islamic festival of breaking the fast',
      isObserved: true,
    },
    
    // APRIL 2025
    {
      id: 7,
      name: 'Pohela Boishakh (Bengali New Year)',
      date: '2025-04-14',
      fromDate: '2025-04-14',
      toDate: '2025-04-14',
      type: 'Cultural Holiday',
      description: 'Bengali New Year - First day of the Bengali calendar',
      isObserved: true,
    },
    {
      id: 8,
      name: 'Good Friday',
      date: '2025-04-18',
      fromDate: '2025-04-18',
      toDate: '2025-04-18',
      type: 'Religious Holiday',
      description: 'Christian commemoration of the crucifixion of Jesus Christ',
      isObserved: true,
    },
    
    // MAY 2025
    {
      id: 9,
      name: 'Buddha Purnima',
      date: '2025-05-12',
      fromDate: '2025-05-12',
      toDate: '2025-05-12',
      type: 'Religious Holiday',
      description: 'Birth, enlightenment, and death of Gautama Buddha',
      isObserved: true,
    },
    
    // JUNE 2025
    {
      id: 10,
      name: 'Eid-ul-Azha',
      date: '2025-06-06',
      fromDate: '2025-06-06',
      toDate: '2025-06-07',
      type: 'Religious Holiday',
      description: 'Festival of Sacrifice - Islamic holiday commemorating Ibrahim\'s willingness to sacrifice',
      isObserved: true,
    },
    
    // JULY 2025
    {
      id: 11,
      name: 'Ashura',
      date: '2025-07-05',
      fromDate: '2025-07-05',
      toDate: '2025-07-05',
      type: 'Religious Holiday',
      description: 'Day of Ashura - Islamic day of mourning',
      isObserved: true,
    },
    
    // AUGUST 2025
    {
      id: 12,
      name: 'National Mourning Day',
      date: '2025-08-15',
      fromDate: '2025-08-15',
      toDate: '2025-08-15',
      type: 'National Holiday',
      description: 'Commemorating the assassination of Sheikh Mujibur Rahman',
      isObserved: true,
    },
    {
      id: 13,
      name: 'Janmashtami',
      date: '2025-08-15',
      fromDate: '2025-08-15',
      toDate: '2025-08-15',
      type: 'Religious Holiday',
      description: 'Birthday of Lord Krishna - Hindu festival',
      isObserved: true,
    },
    
    // SEPTEMBER 2025
    {
      id: 14,
      name: 'Eid-e-Milad-un-Nabi',
      date: '2025-09-05',
      fromDate: '2025-09-05',
      toDate: '2025-09-05',
      type: 'Religious Holiday',
      description: 'Birthday of Prophet Muhammad (PBUH)',
      isObserved: true,
    },
    {
      id: 15,
      name: 'Durga Puja',
      date: '2025-09-30',
      fromDate: '2025-09-30',
      toDate: '2025-10-03',
      type: 'Religious Holiday',
      description: 'Hindu festival celebrating Goddess Durga',
      isObserved: true,
    },
    
    // OCTOBER 2025
    {
      id: 16,
      name: 'Kali Puja',
      date: '2025-10-20',
      fromDate: '2025-10-20',
      toDate: '2025-10-20',
      type: 'Religious Holiday',
      description: 'Hindu festival dedicated to Goddess Kali',
      isObserved: true,
    },
    
    // NOVEMBER 2025
    {
      id: 17,
      name: 'Revolution and Solidarity Day',
      date: '2025-11-07',
      fromDate: '2025-11-07',
      toDate: '2025-11-07',
      type: 'National Holiday',
      description: 'Commemorating the 1975 military uprising',
      isObserved: true,
    },
    
    // DECEMBER 2025
    {
      id: 18,
      name: 'Victory Day',
      date: '2025-12-16',
      fromDate: '2025-12-16',
      toDate: '2025-12-16',
      type: 'National Holiday',
      description: 'Victory Day - Commemorating the victory in the Liberation War',
      isObserved: true,
    },
    {
      id: 19,
      name: 'Christmas Day',
      date: '2025-12-25',
      fromDate: '2025-12-25',
      toDate: '2025-12-25',
      type: 'Religious Holiday',
      description: 'Christian celebration of the birth of Jesus Christ',
      isObserved: true,
    }
  ])

  const [selectedType, setSelectedType] = useState('All')
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    fromDate: '',
    toDate: '',
    type: 'National Holiday',
    description: '',
    duration: '1 day'
  })

  // Get unique holiday types from existing holidays
  const uniqueHolidayTypes = ['All', ...new Set(holidays.map(holiday => holiday.type))]
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
    // Generate consistent colors based on holiday type
    const colors = [
      'text-green-600 bg-green-100',
      'text-blue-600 bg-blue-100', 
      'text-purple-600 bg-purple-100',
      'text-indigo-600 bg-indigo-100',
      'text-orange-600 bg-orange-100',
      'text-pink-600 bg-pink-100',
      'text-red-600 bg-red-100',
      'text-yellow-600 bg-yellow-100',
      'text-teal-600 bg-teal-100',
      'text-cyan-600 bg-cyan-100'
    ]
    
    // Use a simple hash function to get consistent color for same type
    let hash = 0
    for (let i = 0; i < type.length; i++) {
      hash = ((hash << 5) - hash + type.charCodeAt(i)) & 0xffffffff
    }
    return colors[Math.abs(hash) % colors.length]
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

  // Helper function to calculate duration between two dates
  const calculateDuration = (fromDate, toDate) => {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const diffTime = Math.abs(to - from)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end days
    return diffDays === 1 ? '1 day' : `${diffDays} days`
  }

  const handleAddHoliday = () => {
    setEditingHoliday(null)
    setFormData({
      name: '',
      fromDate: '',
      toDate: '',
      type: 'National Holiday',
      description: ''
    })
    setShowAddModal(true)
  }

  const handleEditHoliday = (holiday) => {
    setEditingHoliday(holiday)
    setFormData({
      name: holiday.name,
      fromDate: holiday.fromDate,
      toDate: holiday.toDate,
      type: holiday.type,
      description: holiday.description
    })
    setShowAddModal(true)
  }

  const handleDeleteHoliday = (id) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      setHolidays(prev => prev.filter(holiday => holiday.id !== id))
    }
  }

  const handleSaveHoliday = () => {
    if (!formData.name || !formData.fromDate || !formData.toDate) {
      alert('Please fill in all required fields')
      return
    }

    if (editingHoliday) {
      // Edit existing holiday
      setHolidays(prev => prev.map(holiday => 
        holiday.id === editingHoliday.id 
          ? { ...holiday, ...formData, date: formData.fromDate, isObserved: true }
          : holiday
      ))
    } else {
      // Add new holiday
      const newHoliday = {
        id: Math.max(...holidays.map(h => h.id), 0) + 1,
        ...formData,
        date: formData.fromDate,
        isObserved: true
      }
      setHolidays(prev => [...prev, newHoliday])
    }

    setShowAddModal(false)
    setEditingHoliday(null)
    setFormData({
      name: '',
      fromDate: '',
      toDate: '',
      type: 'National Holiday',
      description: '',
    })
  }

  const handleCancel = () => {
    setShowAddModal(false)
    setEditingHoliday(null)
    setFormData({
      name: '',
      fromDate: '',
      toDate: '',
      type: 'National Holiday',
      description: '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Company Holidays</h1>
          <p className="text-gray-600 mt-1">View and manage company holiday calendar</p>
        </div>
        <button 
          onClick={handleAddHoliday}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          + Add Holiday
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Holiday Days</p>
              <p className="text-2xl font-semibold text-gray-900">
                {holidays.reduce((total, holiday) => {
                  const from = new Date(holiday.fromDate)
                  const to = new Date(holiday.toDate)
                  const diffTime = Math.abs(to - from)
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
                  return total + diffDays
                }, 0)}
              </p>
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
              <p className="text-sm font-medium text-gray-600">Upcoming Days</p>
              <p className="text-2xl font-semibold text-gray-900">
                {holidays.filter(h => isUpcoming(h.date)).reduce((total, holiday) => {
                  const from = new Date(holiday.fromDate)
                  const to = new Date(holiday.toDate)
                  const diffTime = Math.abs(to - from)
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
                  return total + diffDays
                }, 0)}
              </p>
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
              <p className="text-sm font-medium text-gray-600">This Month Days</p>
              <p className="text-2xl font-semibold text-gray-900">
                {holidays.filter(h => {
                  const holidayDate = new Date(h.date)
                  const today = new Date()
                  return holidayDate.getMonth() === today.getMonth() && holidayDate.getFullYear() === today.getFullYear()
                }).reduce((total, holiday) => {
                  const from = new Date(holiday.fromDate)
                  const to = new Date(holiday.toDate)
                  const diffTime = Math.abs(to - from)
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
                  return total + diffDays
                }, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Past Days</p>
              <p className="text-2xl font-semibold text-gray-900">
                {holidays.filter(h => !isUpcoming(h.date) && !isToday(h.date)).reduce((total, holiday) => {
                  const from = new Date(holiday.fromDate)
                  const to = new Date(holiday.toDate)
                  const diffTime = Math.abs(to - from)
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
                  return total + diffDays
                }, 0)}
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
              {uniqueHolidayTypes.map(type => (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
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
                    <span className="text-sm text-gray-900">
                      {(() => {
                        const date = new Date(holiday.fromDate)
                        const month = date.toLocaleDateString('en-GB', { month: 'long' })
                        const year = date.getFullYear()
                        return `${month} ${year}`
                      })()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {(() => {
                        const date = new Date(holiday.fromDate)
                        const day = String(date.getDate()).padStart(2, '0')
                        const month = date.toLocaleDateString('en-GB', { month: 'short' })
                        return `${day} ${month}`
                      })()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {(() => {
                        const date = new Date(holiday.toDate)
                        const day = String(date.getDate()).padStart(2, '0')
                        const month = date.toLocaleDateString('en-GB', { month: 'short' })
                        return `${day} ${month}`
                      })()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {calculateDuration(holiday.fromDate, holiday.toDate)}
                    </span>
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
                      <button 
                        onClick={() => handleEditHoliday(holiday)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteHoliday(holiday.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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

      {/* Add/Edit Holiday Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Holiday Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter holiday name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date *
                  </label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, fromDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date *
                  </label>
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, toDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Holiday Type
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter holiday type (e.g., National Holiday, Religious Holiday, etc.)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder="Enter holiday description"
                  />
                </div>
                
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveHoliday}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {editingHoliday ? 'Update Holiday' : 'Add Holiday'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
