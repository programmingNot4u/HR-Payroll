export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-gray-200 bg-white">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">RP Creations & Apparels Limited</span>
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
          <button className="h-9 w-9 rounded-full bg-gray-200" aria-label="User menu" />
        </div>
      </div>
    </header>
  )
}


