import React, { useState, useRef } from 'react'
import { Plus, Upload, Send, Users, Filter, Search, Eye, Download, X, Calendar, Clock, MapPin, FileText, Image, File } from 'lucide-react'

const NoticesAnnouncements = () => {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Holiday Schedule 2024',
      content: 'Please find attached the complete holiday schedule for 2024. Plan your time off accordingly.',
      category: 'Holiday',
      priority: 'High',
      date: '2024-01-15',
      author: 'HR Department',
      isRead: false,
      attachments: ['holiday-schedule-2024.pdf'],
      recipients: 'All Employees',
      departments: ['All'],
      designations: ['All']
    },
    {
      id: 2,
      title: 'Monthly Team Meeting - January 2024',
      content: 'Join us for our monthly team meeting on January 25th at 2:00 PM. Agenda includes Q4 results review and Q1 planning discussion.',
      category: 'Meeting',
      priority: 'Medium',
      date: '2024-01-20',
      author: 'Management Team',
      isRead: true,
      attachments: ['meeting-agenda.pdf'],
      recipients: 'Selected',
      departments: ['Management', 'HR'],
      designations: ['Manager', 'Senior Manager']
    },
    {
      id: 3,
      title: 'Office Maintenance Notice',
      content: 'Scheduled maintenance will be conducted on the 3rd floor this weekend. Please expect some noise and temporary access restrictions.',
      category: 'Maintenance',
      priority: 'Low',
      date: '2024-01-18',
      author: 'Facilities Team',
      isRead: true,
      attachments: [],
      recipients: 'All Employees',
      departments: ['All'],
      designations: ['All']
    }
  ])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [selectedNotice, setSelectedNotice] = useState(null)
  const fileInputRef = useRef(null)

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium',
    recipients: 'All',
    departments: [],
    designations: [],
    attachments: []
  })

  const categories = ['General', 'Holiday', 'Meeting', 'Policy Update', 'Maintenance', 'Event', 'Emergency']
  const priorities = ['Low', 'Medium', 'High', 'Urgent']
  const departments = ['All', 'HR', 'IT', 'Finance', 'Marketing', 'Sales', 'Operations', 'Management']
  const designations = ['All', 'Intern', 'Associate', 'Senior Associate', 'Manager', 'Senior Manager', 'Director', 'VP']

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
      case 'Urgent':
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
      case 'Holiday':
        return 'bg-pink-100 text-pink-800'
      case 'Meeting':
        return 'bg-purple-100 text-purple-800'
      case 'Policy Update':
        return 'bg-blue-100 text-blue-800'
      case 'Maintenance':
        return 'bg-orange-100 text-orange-800'
      case 'Event':
        return 'bg-indigo-100 text-indigo-800'
      case 'Emergency':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || notice.category === filterCategory
    const matchesPriority = filterPriority === 'All' || notice.priority === filterPriority
    return matchesSearch && matchesCategory && matchesPriority
  })

  const handleCreateNotice = () => {
    const newNotice = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      author: 'Current User',
      isRead: false
    }
    setNotices(prev => [newNotice, ...prev])
    setIsCreateModalOpen(false)
    setFormData({
      title: '',
      content: '',
      category: 'General',
      priority: 'Medium',
      recipients: 'All',
      departments: [],
      designations: [],
      attachments: []
    })
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }))
  }

  const removeAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }))
  }

  const handleDepartmentChange = (dept) => {
    if (dept === 'All') {
      setFormData(prev => ({ ...prev, departments: ['All'] }))
    } else {
      setFormData(prev => ({
        ...prev,
        departments: prev.departments.includes('All') ? [dept] : 
                    prev.departments.includes(dept) ? 
                    prev.departments.filter(d => d !== dept) : 
                    [...prev.departments, dept]
      }))
    }
  }

  const handleDesignationChange = (desig) => {
    if (desig === 'All') {
      setFormData(prev => ({ ...prev, designations: ['All'] }))
    } else {
      setFormData(prev => ({
        ...prev,
        designations: prev.designations.includes('All') ? [desig] : 
                     prev.designations.includes(desig) ? 
                     prev.designations.filter(d => d !== desig) : 
                     [...prev.designations, desig]
      }))
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.includes('image')) return <Image className="w-4 h-4" />
    if (type.includes('pdf')) return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notices & Announcements</h1>
                <p className="text-gray-600">Create and manage company notices, holidays, and announcements</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200"
              >
                <Upload className="w-4 h-4" />
                Upload Notice
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-md"
              >
                <Plus className="w-4 h-4" />
                Create Notice
              </button>
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
                <FileText className="w-6 h-6 text-blue-600" />
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
                <Clock className="w-6 h-6 text-red-600" />
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
                <Calendar className="w-6 h-6 text-yellow-600" />
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
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent Today</p>
                <p className="text-2xl font-bold text-gray-900">{notices.filter(n => n.date === new Date().toISOString().split('T')[0]).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All Priorities</option>
                {priorities.map(pri => (
                  <option key={pri} value={pri}>{pri}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map(notice => (
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
                  
                  {/* Attachments */}
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {notice.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm">
                            {getFileIcon(attachment.type || 'file')}
                            <span>{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                  <span className="text-sm text-gray-500">
                    To: {notice.recipients}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {notice.date}
                  </span>
                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Create Notice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Notice</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter notice title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter notice content"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {priorities.map(pri => (
                      <option key={pri} value={pri}>{pri}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="recipients"
                      value="All"
                      checked={formData.recipients === 'All'}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                      className="mr-2"
                    />
                    All Employees
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="recipients"
                      value="Selected"
                      checked={formData.recipients === 'Selected'}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                      className="mr-2"
                    />
                    Selected Employees
                  </label>
                </div>
              </div>

              {formData.recipients === 'Selected' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                    <div className="grid grid-cols-2 gap-2">
                      {departments.map(dept => (
                        <label key={dept} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.departments.includes(dept)}
                            onChange={() => handleDepartmentChange(dept)}
                            className="mr-2"
                          />
                          {dept}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designations</label>
                    <div className="grid grid-cols-2 gap-2">
                      {designations.map(desig => (
                        <label key={desig} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.designations.includes(desig)}
                            onChange={() => handleDesignationChange(desig)}
                            className="mr-2"
                          />
                          {desig}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 text-gray-500 hover:text-gray-700"
                  >
                    <Upload className="w-8 h-8" />
                    <span>Click to upload files or drag and drop</span>
                    <span className="text-xs">PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB each)</span>
                  </button>
                </div>
                
                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.attachments.map(attachment => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getFileIcon(attachment.type)}
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                        </div>
                        <button
                          onClick={() => removeAttachment(attachment.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotice}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-md"
              >
                <Send className="w-4 h-4 inline mr-2" />
                Send Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Notice Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Upload Notice Document</h2>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload notice document</p>
                <p className="text-sm text-gray-500 mb-4">PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB)</p>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200">
                  Choose File
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Details Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{selectedNotice.title}</h2>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Content</h3>
                  <p className="text-gray-600">{selectedNotice.content}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Category</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedNotice.category)}`}>
                      {selectedNotice.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Priority</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(selectedNotice.priority)}`}>
                      {selectedNotice.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Author</h3>
                    <p className="text-gray-600">{selectedNotice.author}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Date</h3>
                    <p className="text-gray-600">{selectedNotice.date}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Recipients</h3>
                  <p className="text-gray-600">{selectedNotice.recipients}</p>
                  {selectedNotice.recipients === 'Selected' && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Departments: {selectedNotice.departments.join(', ')}</p>
                      <p className="text-sm text-gray-500">Designations: {selectedNotice.designations.join(', ')}</p>
                    </div>
                  )}
                </div>

                {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {selectedNotice.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {getFileIcon(attachment.type || 'file')}
                            <span className="text-sm">{attachment}</span>
                          </div>
                          <button className="text-orange-500 hover:text-orange-700">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200">
                <Send className="w-4 h-4 inline mr-2" />
                Resend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoticesAnnouncements