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
      date: '2024-01-25',
      author: 'HR Department',
      isRead: true
    }
  ])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Policy Update':
        return 'bg-blue-100 text-blue-800'
      case 'Meeting':
        return 'bg-purple-100 text-purple-800'
      case 'Maintenance':
        return 'bg-orange-100 text-orange-800'
      case 'Program Update':
        return 'bg-indigo-100 text-indigo-800'
      case 'Holiday':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notices & Announcements</h1>
              <p className="text-gray-600">Stay updated with the latest company news, policy changes, and important announcements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notices</p>
                <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{notices.filter(n => !n.isRead).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{notices.filter(n => new Date(n.date).getMonth() === new Date().getMonth()).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{notices.filter(n => n.isRead).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {notices.map(notice => (
            <div key={notice.id} className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow ${!notice.isRead ? 'border-l-4 border-l-orange-500' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                    {!notice.isRead && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{notice.content}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(notice.category)}`}>
                    {notice.category}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(notice.priority)}`}>
                    {notice.priority}
                  </span>
                  <span className="text-sm text-gray-500">
                    By {notice.author}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {notice.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {notices.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notices available</h3>
            <p className="text-gray-500">Check back later for new announcements and updates.</p>
          </div>
        )}
      </div>
    </div>
  )
}
