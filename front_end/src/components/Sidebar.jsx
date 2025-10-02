import { useState } from 'react'

const SectionIcon = ({ name, selected = false, highlighted = false }) => {
  const common = `h-4 w-4 transition-colors ${selected ? 'text-white' : highlighted ? 'text-orange-600' : 'text-gray-500'} group-hover:text-white`
  switch (name) {
    case 'Dashboard':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 0h11v8H10v-8z" />
        </svg>
      )
    case 'Employees':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M16 11a4 4 0 10-8 0 4 4 0 008 0zm-9 7a6 6 0 0110 0v2H7v-2z" />
        </svg>
      )
    case 'Payroll':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm7 1a3 3 0 00-3 3h2a1 1 0 112 0c0 .552-.448 1-1 1h-1v2h1a3 3 0 100-6z" />
        </svg>
      )
    case 'Attendance':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M6 2h2v2h8V2h2v2h3v18H3V4h3V2zm15 6H3v12h18V8zM7 12h5v5H7v-5z" />
        </svg>
      )
    case 'Recruitment':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M10 2l4 4H5a3 3 0 00-3 3v9a3 3 0 003 3h14a3 3 0 003-3V8h-6l-4-4z" />
        </svg>
      )
    case 'Performance':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M3 13h4v8H3v-8zm7-6h4v14h-4V7zm7 3h4v11h-4V10z" />
        </svg>
      )
    case 'Company Details':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    case 'Legal Documents':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H8" />
        </svg>
      )
    case 'Assets':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M4 7l8-4 8 4v10l-8 4-8-4V7zm8 10l6-3V9l-6 3v5z" />
        </svg>
      )
    case 'Audit Log':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )

    case 'User Management':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H5z" />
        </svg>
      )
    case 'Settings':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <path d="M19.14 12.936a7.963 7.963 0 000-1.872l2.036-1.58-1.5-2.598-2.41.97a7.994 7.994 0 00-1.62-.94l-.36-2.56h-3l-.36 2.56c-.57.22-1.11.52-1.62.94l-2.41-.97-1.5 2.598 2.04 1.58c-.05.31-.08.62-.08.936s.03.626.08.936l-2.04 1.58 1.5 2.598 2.41-.97c.51.42 1.05.72 1.62.94l.36 2.56h3l.36-2.56c.57-.22 1.11-.52 1.62-.94l2.41.97 1.5-2.598-2.04-1.58zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
        </svg>
      )
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={common}>
          <circle cx="12" cy="12" r="5" />
        </svg>
      )
  }
}

const sections = [
  {
    title: 'Dashboard',
    items: ['Overview', 'Reports'],
  },
  {
    title: 'Employees',
    items: ['Employee Dashboard', 'Add Employee', 'Employee Details', 'Employee Portal'],
  },
  {
    title: 'Payroll',
    items: ['Salary & Payslips', 'Overtime || Bonuses || Penalties', 'Advance From Accounts'],
  },
  {
    title: 'Attendance',
    items: ['Daily Attendance', 'Timesheets', 'Leave Management', 'Holidays', 'Leave Policies'],
  },
  {
    title: 'Recruitment',
    items: ['Job Openings', 'Candidates'],
  },
  {
    title: 'Performance',
    items: ['KPI'],
  },
  {
    title: 'Assets',
    items: ['Asset Inventory', 'Assign Asset', 'Asset Return', 'Asset Tracker', 'Maintenance'],
  },


  {
    title: 'Settings',
    items: ['Company Info', 'Legal Documents', 'Organizational Metrics', 'Policies', 'Notices & Announcements', 'Notification Settings', 'Audit Log'],
  },
]

export default function Sidebar({ selectedItem, onSelect, hasUnreadNotifications }) {
  const [openSections, setOpenSections] = useState(() => {
    const initial = new Set()
    if (selectedItem) {
      const owner = sections.find(s => s.items.includes(selectedItem))
      if (owner) initial.add(owner.title)
    }
    return initial
  })

  const toggleSection = (title) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-72 overflow-y-auto border-r border-gray-200 bg-white">
      {/* Alert Indicator */}
      {hasUnreadNotifications && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-3">
          <div className="flex items-center gap-2 text-orange-700">
            <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium">You have unread notifications</span>
          </div>
        </div>
      )}
      <div className="p-4 text-xl font-semibold"></div>
      <nav className="px-2 pb-6">
        {sections.map(section => {
          const isOpen = openSections.has(section.title)
          const isParentSelected = section.items.includes(selectedItem)
          return (
            <div key={section.title} className="mb-2">
              <button
                className={`group w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors
                  ${isParentSelected ? 'bg-orange-500 text-white' : 'hover:bg-orange-500 hover:text-white'}`}
                onClick={() => toggleSection(section.title)}
              >
                <span className="flex items-center gap-2 font-medium">
                  <SectionIcon name={section.title} selected={isParentSelected} highlighted={isOpen} />
                  {section.title}
                </span>
                <span className={`text-sm ${isParentSelected ? 'text-orange-600' : 'text-gray-500'}`}>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <ul className="mt-1 ml-3 border-l border-gray-200">
                  {section.items.map(item => {
                    const isSelected = selectedItem === item
                    return (
                      <li key={item}>
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); onSelect && onSelect(item) }}
                          className={`block pl-3 pr-2 py-2 text-sm rounded-l transition-colors
                            ${isSelected ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-700'}
                            hover:bg-orange-50 hover:text-orange-600`}
                        >
                          {item}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}


