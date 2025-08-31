import { useState } from 'react'

const NotificationSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    payrollReminders: true,
    attendanceAlerts: true,
    leaveApprovals: true,
    performanceReviews: true,
    companyAnnouncements: true,
    complianceMode: true
  })

  const handleSave = () => {
    console.log('Saving notification settings...', notificationSettings)
    // In a real app, this would make an API call
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notification Settings</h1>
          <p className="text-sm text-gray-500">Configure how and when you receive notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Compliance Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.complianceMode}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, complianceMode: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
            <span className="text-xs text-gray-500">
              {notificationSettings.complianceMode ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.smsNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications in the app</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.pushNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Notification Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                <div>
                  <h4 className="font-medium">Payroll Reminders</h4>
                  <p className="text-sm text-gray-500">Get reminded about payroll processing</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.payrollReminders}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, payrollReminders: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                <div>
                  <h4 className="font-medium">Attendance Alerts</h4>
                  <p className="text-sm text-gray-500">Get alerts for attendance issues</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.attendanceAlerts}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, attendanceAlerts: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                <div>
                  <h4 className="font-medium">Leave Approvals</h4>
                  <p className="text-sm text-gray-500">Get notified about leave requests</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.leaveApprovals}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, leaveApprovals: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                <div>
                  <h4 className="font-medium">Performance Reviews</h4>
                  <p className="text-sm text-gray-500">Get notified about performance reviews</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.performanceReviews}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, performanceReviews: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                <div>
                  <h4 className="font-medium">Company Announcements</h4>
                  <p className="text-sm text-gray-500">Get notified about company updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.companyAnnouncements}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, companyAnnouncements: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors"
          >
            Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings
