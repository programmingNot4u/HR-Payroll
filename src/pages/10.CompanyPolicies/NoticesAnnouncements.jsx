import { useState } from 'react'

export default function NoticesAnnouncements() {
  const [notices] = useState([
    {
      id: 1,
      title: 'Company Policy Update - Remote Work Guidelines',
      content: 'Effective immediately, all employees are required to follow the updated remote work guidelines. Please review the new policy document in the company portal.',
      category: 'Policy Update',
      priority: 'High',
      date: '2024-01-15',
      author: 'HR Department',
      isRead: false
    },
    {
      id: 2,
      title: 'Monthly Team Meeting - January 2024',
      content: 'Join us for our monthly team meeting on January 25th at 2:00 PM. Agenda includes Q4 results review and Q1 planning discussion.',
      category: 'Meeting',
      priority: 'Medium',
      date: '2024-01-20',
      author: 'Management Team',
      isRead: true
    },
    {
      id: 3,
      title: 'Office Maintenance Notice',
      content: 'Scheduled maintenance will be conducted on the 3rd floor this weekend. Please expect some noise and temporary access restrictions.',
      category: 'Maintenance',
      priority: 'Low',
      date: '2024-01-18',
      author: 'Facilities Team',
      isRead: true
    },
    {
      id: 4,
      title: 'New Employee Onboarding Program',
      content: 'We are excited to announce our enhanced employee onboarding program starting next month. This will provide better support for new team members.',
      category: 'Program Update',
      priority: 'Medium',
      date: '2024-01-22',
      author: 'HR Department',
      isRead: false
    },
    {
      id: 5,
      title: 'Holiday Schedule for 2024',
      content: 'The complete holiday schedule for 2024 has been published. Please review and plan your time off accordingly.',
      category: 'Holiday',
      priority: 'High',
      date: '2024-01-10',
      author: 'HR Department',
      isRead: true
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', 'Policy Update', 'Meeting', 'Maintenance', 'Program Update', 'Holiday']
  const priorities = { 'High': 'text-red-600 bg-red-100', 'Medium': 'text-yellow-600 bg-yellow-100', 'Low': 'text-green-600 bg-green-100' }

  const filteredNotices = notices.filter(notice => {
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notices & Announcements</h1>
          <p className="text-gray-600 mt-1">Stay updated with company news and important information</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          + New Notice
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map(notice => (
          <div key={notice.id} className={`bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${
            !notice.isRead ? 'border-l-4 border-l-orange-500' : ''
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-lg font-semibold ${!notice.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notice.title}
                  </h3>
                  {!notice.isRead && (
                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{notice.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By: {notice.author}</span>
                  <span>Date: {(() => {
                    const date = new Date(notice.date)
                    const day = String(date.getDate()).padStart(2, '0')
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const year = date.getFullYear()
                    return `${day}/${month}/${year}`
                  })()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorities[notice.priority]}`}>
                    {notice.priority}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {notice.category}
                  </span>
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

      {filteredNotices.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notices found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}
