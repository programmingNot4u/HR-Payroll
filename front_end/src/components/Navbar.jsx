import { useState, useEffect } from 'react'

export default function Navbar({ onLogout, onNavigate, hasUnreadNotifications }) {
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [companyName, setCompanyName] = useState('RP Creations & Apparels Limited')
  const [notifications, setNotifications] = useState([])

  // Generate sample notifications
  const generateNotifications = () => {
    const sampleNotifications = [
      {
        id: 1,
        type: 'legal_document',
        title: 'Legal Document Expiring Soon',
        message: 'Trade License expires in 15 days',
        timestamp: new Date().toISOString(),
        priority: 'high',
        read: false,
        targetPage: 'Legal Documents'
      },
      {
        id: 2,
        type: 'leave_request',
        title: 'New Leave Request',
        message: 'Ahmed Khan requested 3 days of casual leave',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        priority: 'medium',
        read: false,
        targetPage: 'Leave Management'
      },
      {
        id: 3,
        type: 'legal_document',
        title: 'Legal Document Expiring Soon',
        message: 'Fire Safety Certificate expires in 7 days',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        priority: 'high',
        read: false,
        targetPage: 'Legal Documents'
      },
      {
        id: 4,
        type: 'leave_request',
        title: 'New Leave Request',
        message: 'Fatima Begum requested 1 day of sick leave',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        priority: 'medium',
        read: true,
        targetPage: 'Leave Management'
      },
      {
        id: 5,
        type: 'leave_request',
        title: 'New Leave Request',
        message: 'Mohammad Hassan requested 5 days of earned leave',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        priority: 'low',
        read: true,
        targetPage: 'Leave Management'
      }
    ]
    return sampleNotifications
  }

  useEffect(() => {
    const userData = localStorage.getItem('adminUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load company name from localStorage
    const companyInfo = localStorage.getItem('companyInfo')
    if (companyInfo) {
      const parsed = JSON.parse(companyInfo)
      setCompanyName(parsed.name)
    }

    // Generate notifications
    setNotifications(generateNotifications())

    // Listen for company name changes
    const handleCompanyNameChange = (event) => {
      setCompanyName(event.detail.companyName)
    }

    window.addEventListener('companyNameChanged', handleCompanyNameChange)

    return () => {
      window.removeEventListener('companyNameChanged', handleCompanyNameChange)
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('[data-notification-dropdown]')) {
        setShowNotifications(false)
      }
      if (showUserMenu && !event.target.closest('[data-user-menu]')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications, showUserMenu])

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Fallback logout
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      window.dispatchEvent(new CustomEvent('adminLogout'))
    }
    setShowUserMenu(false)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id)
    
    // Close notification dropdown
    setShowNotifications(false)
    
    // Navigate to target page
    if (onNavigate && notification.targetPage) {
      onNavigate(notification.targetPage)
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getTypeIcon = (type) => {
    if (type === 'legal_document') {
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    } else {
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-gray-200 bg-white">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">{companyName}</span>
          <span className="hidden sm:inline-block text-gray-400">|</span>
          <span className="hidden sm:inline-block text-sm text-gray-500">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="hidden md:block w-64 h-9 rounded border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="h-9 px-3 rounded text-sm border border-gray-300 hover:bg-gray-50">Help</button>
          {/* Notifications */}
          <div className="relative" data-notification-dropdown>
          <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative h-9 w-9 grid place-items-center rounded-full hover:bg-orange-50 transition-colors ${
                unreadCount > 0 ? 'bg-orange-50' : ''
              }`}
            aria-label="Notifications"
            title="Notifications"
          >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-5 w-5 transition-colors ${
                unreadCount > 0 ? 'text-orange-700 animate-pulse' : 'text-orange-600'
              }`}>
              <path d="M12 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 006 14h12a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6z" />
              <path d="M9 18a3 3 0 006 0H9z" />
            </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-orange-500 text-white text-[10px] leading-4 text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-orange-600 hover:text-orange-700"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-orange-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 ${getPriorityColor(notification.priority)}`}>
                            {getTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 ml-2"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-orange-600 hover:text-orange-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative" data-user-menu>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 h-9 px-3 rounded-full hover:bg-gray-50 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</div>
                <div className="text-xs text-gray-500">{user?.role || 'Administrator'}</div>
              </div>
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</div>
                  <div className="text-xs text-gray-500">{user?.email || 'admin@hrpayroll.com'}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
          </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


