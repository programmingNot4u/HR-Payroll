import { useState, useEffect } from 'react'

export default function Navbar({ onLogout }) {
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [companyName, setCompanyName] = useState('RP Creations & Apparels Limited')

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

    // Listen for company name changes
    const handleCompanyNameChange = (event) => {
      setCompanyName(event.detail.companyName)
    }

    window.addEventListener('companyNameChanged', handleCompanyNameChange)

    return () => {
      window.removeEventListener('companyNameChanged', handleCompanyNameChange)
    }
  }, [])

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
          <button
            className="relative h-9 w-9 grid place-items-center rounded-full hover:bg-orange-50"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-orange-600">
              <path d="M12 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 006 14h12a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6z" />
              <path d="M9 18a3 3 0 006 0H9z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-orange-500 text-white text-[10px] leading-4 text-center">3</span>
          </button>
          
          {/* User Menu */}
          <div className="relative">
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


