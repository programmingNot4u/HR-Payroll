import React, { useState, useRef, useEffect } from 'react'
import { Plus, Upload, Users, Filter, Search, Download, X, Calendar, Clock, MapPin, FileText, Image, File, Eye, Send } from 'lucide-react'
import employeeService from '../../services/employeeService'

const NoticesAnnouncements = () => {
  // Utility function to format date to dd/mm/yyyy
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Helper function to create file-like objects
  const createFileObject = (content, filename, type = 'text/plain') => {
    try {
      // Try to use File constructor if available
      if (typeof File !== 'undefined') {
        return new File([content], filename, { type })
      } else {
        // Fallback: create a blob and return a file-like object
        const blob = new Blob([content], { type })
        return {
          name: filename,
          size: content.length,
          type: type,
          lastModified: Date.now(),
          text: () => Promise.resolve(content),
          arrayBuffer: () => Promise.resolve(new TextEncoder().encode(content).buffer)
        }
      }
    } catch (error) {
      console.error('Error creating file object:', error)
      // Fallback: return a simple object
      return {
        name: filename,
        size: content.length,
        type: type,
        lastModified: Date.now(),
        content: content
      }
    }
  }

  // Helper function to convert dd/mm/yyyy to yyyy-mm-dd for date input
  const convertToDateInput = (ddmmyyyy) => {
    if (!ddmmyyyy) return ''
    const parts = ddmmyyyy.split('/')
    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    return ddmmyyyy
  }

  // Helper function to convert yyyy-mm-dd to dd/mm/yyyy for display
  const convertFromDateInput = (yyyymmdd) => {
    if (!yyyymmdd) return ''
    const parts = yyyymmdd.split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts
      return `${day}/${month}/${year}`
    }
    return yyyymmdd
  }

  // Custom Date Input Component
  const CustomDateInput = ({ value, onChange, className, placeholder }) => {
    const [displayValue, setDisplayValue] = useState(convertFromDateInput(value))
    const [isValid, setIsValid] = useState(true)

    const handleChange = (e) => {
      const inputValue = e.target.value
      setDisplayValue(inputValue)
      
      // Validate dd/mm/yyyy format
      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
      const match = inputValue.match(dateRegex)
      
      if (match) {
        const [, day, month, year] = match
        const dayNum = parseInt(day, 10)
        const monthNum = parseInt(month, 10)
        const yearNum = parseInt(year, 10)
        
        // Basic validation
        if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900) {
          const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          onChange(dateStr)
          setIsValid(true)
        } else {
          setIsValid(false)
        }
      } else if (inputValue === '') {
        onChange('')
        setIsValid(true)
      } else {
        setIsValid(false)
      }
    }

    const handleBlur = () => {
      if (value) {
        setDisplayValue(convertFromDateInput(value))
      }
    }

    return (
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder || "dd/mm/yyyy"}
        className={`${className} ${!isValid ? 'border-red-500 focus:ring-red-500' : ''}`}
      />
    )
  }

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
  const [isCreateAnnouncementModalOpen, setIsCreateAnnouncementModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [activeTab, setActiveTab] = useState('notices')
  const fileInputRef = useRef(null)

  // Templates state
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [shareType, setShareType] = useState('all')
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [showEmployeeList, setShowEmployeeList] = useState(false)
  const [textContent, setTextContent] = useState('')
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(true)
  const [showEmployeeSelection, setShowEmployeeSelection] = useState(false)
  const [currentFormType, setCurrentFormType] = useState('notice') // 'notice' or 'announcement'

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recipients: 'All',
    departments: [],
    designations: [],
    attachments: [],
    date: '',
    selectedEmployees: []
  })

  const [announcementData, setAnnouncementData] = useState({
    title: '',
    content: '',
    recipients: 'All',
    departments: [],
    designations: [],
    attachments: [],
    date: '',
    location: '',
    selectedEmployees: []
  })

  const categories = ['General', 'Holiday', 'Meeting', 'Policy Update', 'Maintenance', 'Event', 'Emergency']
  const announcementTypes = ['General', 'Event', 'Training', 'Award', 'Promotion', 'Company Update', 'Social', 'Health & Safety']
  const priorities = ['Low', 'Medium', 'High', 'Urgent']
  const departments = ['All', 'Cutting Department', 'Printing Department', 'Embroidery Department', 'Sewing Department', 'Washing Department', 'Finishing Department', 'Quality Control (QC) Department']
  const designations = ['All', 'Software Engineer', 'Senior Software Engineer', 'Product Manager', 'HR Manager', 'HR Executive', 'Marketing Manager', 'Marketing Executive', 'Finance Manager', 'Accountant', 'Operations Manager', 'Quality Inspector', 'Production Manager']

  // Real employee data from employee dashboard
  const [employees, setEmployees] = useState([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)

  // Load employees from employee service
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true)
        const employeeData = await employeeService.getAllEmployees()
        setEmployees(employeeData)
      } catch (error) {
        console.error('Error loading employees:', error)
        setEmployees([])
      } finally {
        setLoadingEmployees(false)
      }
    }
    
    loadEmployees()
  }, [])

  // HR Templates data
  const hrTemplates = [
    {
      id: 'holiday-notice',
      name: 'Holiday Notice',
      type: 'txt',
      content: `HOLIDAY NOTICE

Dear All,

We are pleased to inform you that our office will be closed on [DATE] in observance of [HOLIDAY NAME].

Office Closure Details:
- Date: [DATE]
- Reason: [HOLIDAY NAME]
- Resumption: [NEXT WORKING DAY]

Please ensure all urgent matters are completed before the holiday. For any emergency, please contact [EMERGENCY CONTACT].

We wish you a pleasant holiday!

Best regards,
[HR DEPARTMENT]
[COMPANY NAME]
[CONTACT INFORMATION]`
    },
    {
      id: 'joining-letter',
      name: 'Joining Letter',
      type: 'txt',
      content: `JOINING LETTER

[COMPANY LETTERHEAD]

Date: [DATE]

To,
[EMPLOYEE NAME]
[EMPLOYEE ADDRESS]

Subject: Joining Letter - [POSITION]

Dear [EMPLOYEE NAME],

We are pleased to offer you the position of [POSITION] at [COMPANY NAME]. Your employment will commence on [JOINING DATE].

Employment Details:
- Position: [POSITION]
- Department: [DEPARTMENT]
- Reporting Manager: [MANAGER NAME]
- Joining Date: [JOINING DATE]
- Working Hours: [WORKING HOURS]
- Probation Period: [PROBATION PERIOD]

Please report to [LOCATION] on [JOINING DATE] at [TIME] for your orientation session.

Required Documents:
- Educational certificates
- Previous employment letters
- Identity proof
- Address proof
- Passport size photographs

We look forward to welcoming you to our team!

Best regards,
[HR MANAGER NAME]
[COMPANY NAME]
[CONTACT INFORMATION]`
    },
    {
      id: 'resignation-letter',
      name: 'Resignation Letter',
      type: 'txt',
      content: `RESIGNATION LETTER

[EMPLOYEE LETTERHEAD]

Date: [DATE]

To,
[MANAGER NAME]
[COMPANY NAME]
[COMPANY ADDRESS]

Subject: Resignation from [POSITION]

Dear [MANAGER NAME],

I am writing to formally inform you of my decision to resign from my position as [POSITION] at [COMPANY NAME]. My last working day will be [LAST WORKING DAY].

I am grateful for the opportunities and experiences I have gained during my time at [COMPANY NAME]. I have learned a great deal and have enjoyed working with the team.

I will ensure a smooth transition by completing all pending tasks and providing proper handover documentation.

Thank you for your understanding and support.

Best regards,
[EMPLOYEE NAME]
[EMPLOYEE CONTACT]`
    }
  ]

  // Mock employee data
  const mockEmployees = [
    { id: 1, name: 'John Doe', email: 'john.doe@company.com', department: 'HR' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', department: 'Finance' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'IT' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Marketing' },
    { id: 5, name: 'David Brown', email: 'david.brown@company.com', department: 'Operations' }
  ]

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
    return matchesSearch
  })

  const handleCreateNotice = () => {
    const newNotice = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      author: 'Current User',
      isRead: false,
      type: 'Notice'
    }
    setNotices(prev => [newNotice, ...prev])
    setIsCreateModalOpen(false)
    setFormData({
      title: '',
      content: '',
      recipients: 'All',
      departments: [],
      designations: [],
      attachments: [],
      date: '',
      selectedEmployees: []
    })
  }

  const handleCreateAnnouncement = () => {
    const newAnnouncement = {
      id: Date.now(),
      ...announcementData,
      date: new Date().toISOString().split('T')[0],
      author: 'Current User',
      isRead: false,
      type: 'Announcement'
    }
    setNotices(prev => [newAnnouncement, ...prev])
    setIsCreateAnnouncementModalOpen(false)
    setAnnouncementData({
      title: '',
      content: '',
      recipients: 'All',
      departments: [],
      designations: [],
      attachments: [],
      date: '',
      location: '',
      selectedEmployees: []
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

  const handleAnnouncementFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    setAnnouncementData(prev => ({
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

  const removeAnnouncementAttachment = (attachmentId) => {
    setAnnouncementData(prev => ({
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

  const handleAnnouncementDepartmentChange = (dept) => {
    if (dept === 'All') {
      setAnnouncementData(prev => ({ ...prev, departments: ['All'] }))
    } else {
      setAnnouncementData(prev => ({
        ...prev,
        departments: prev.departments.includes('All') ? [dept] : 
                    prev.departments.includes(dept) ? 
                    prev.departments.filter(d => d !== dept) : 
                    [...prev.departments, dept]
      }))
    }
  }

  const handleAnnouncementDesignationChange = (desig) => {
    if (desig === 'All') {
      setAnnouncementData(prev => ({ ...prev, designations: ['All'] }))
    } else {
      setAnnouncementData(prev => ({
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

  // Template functions
  const handleTemplateFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file: file
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleTemplateDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    handleTemplateFileUpload(files)
  }

  const handleTemplateDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleTemplateDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleTemplateFileInput = (e) => {
    const files = e.target.files
    handleTemplateFileUpload(files)
  }

  const removeTemplateFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
  }


  const handleEditTemplateFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase()
    
    if (['txt'].includes(fileExtension)) {
      openTemplateTextEditor(file)
    } else {
      const url = URL.createObjectURL(file.file)
      window.open(url, '_blank')
      alert('File opened in new tab. For editing, please use appropriate software or download the file.')
    }
  }

  const handleDeleteTemplateFile = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setUploadedFiles(prev => prev.filter(file => file.id !== id))
    }
  }


  const handleEmployeeToggle = (employee) => {
    setSelectedEmployees(prev => {
      if (prev.find(emp => emp.id === employee.id)) {
        return prev.filter(emp => emp.id !== employee.id)
      } else {
        return [...prev, employee]
      }
    })
  }

  const handleFormEmployeeToggle = (employee) => {
    if (currentFormType === 'notice') {
      setFormData(prev => ({
        ...prev,
        selectedEmployees: prev.selectedEmployees.find(emp => emp.id === employee.id)
          ? prev.selectedEmployees.filter(emp => emp.id !== employee.id)
          : [...prev.selectedEmployees, employee]
      }))
    } else {
      setAnnouncementData(prev => ({
        ...prev,
        selectedEmployees: prev.selectedEmployees.find(emp => emp.id === employee.id)
          ? prev.selectedEmployees.filter(emp => emp.id !== employee.id)
          : [...prev.selectedEmployees, employee]
      }))
    }
  }

  const openEmployeeSelection = (formType) => {
    setCurrentFormType(formType)
    setShowEmployeeSelection(true)
  }

  const closeEmployeeSelection = () => {
    setShowEmployeeSelection(false)
    setCurrentFormType('notice')
  }

  const handleSendTemplate = () => {
    if (shareType === 'all') {
      alert(`Template "${selectedFile.name}" sent to all employees!`)
    } else if (selectedEmployees.length > 0) {
      const employeeNames = selectedEmployees.map(emp => emp.name).join(', ')
      alert(`Template "${selectedFile.name}" sent to: ${employeeNames}`)
    } else {
      alert('Please select at least one employee')
      return
    }
    setShowShareModal(false)
    setSelectedFile(null)
    setSelectedEmployees([])
  }

  const closeShareModal = () => {
    setShowShareModal(false)
    setSelectedFile(null)
    setSelectedEmployees([])
    setShareType('all')
  }

  const openTemplateTextEditor = async (file) => {
    try {
      let text
      if (file.file && typeof file.file.text === 'function') {
        text = await file.file.text()
      } else if (file.file && file.file.content) {
        text = file.file.content
      } else if (file.content) {
        text = file.content
      } else {
        text = ''
      }
      setTextContent(text)
      setSelectedFile(file)
      setShowTextEditor(true)
    } catch (error) {
      console.error('Error reading file content:', error)
      alert('Error reading file content: ' + error.message)
    }
  }

  const saveTemplateTextFile = () => {
    if (selectedFile) {
      const updatedFile = createFileObject(textContent, selectedFile.name, 'text/plain')
      
      // Update the file in uploadedFiles
      setUploadedFiles(prev => prev.map(file => 
        file.id === selectedFile.id 
          ? { ...file, file: updatedFile, size: updatedFile.size, lastModified: Date.now() }
          : file
      ))
      
      setShowTextEditor(false)
      setSelectedFile(null)
      setTextContent('')
      alert('File saved successfully!')
    }
  }

  const closeTemplateTextEditor = () => {
    setShowTextEditor(false)
    setSelectedFile(null)
    setTextContent('')
  }

  const addTemplateToLibrary = (template) => {
    console.log('Add template to library called with:', template)
    console.log('Current uploaded files:', uploadedFiles)
    
    try {
      // Check if template already exists in uploaded files
      const existingFile = uploadedFiles.find(file => 
        file.name === `${template.name}.txt` && file.isTemplate
      )
      
      if (existingFile) {
        console.log('Template already exists:', existingFile)
        alert('This template is already in your library!')
        return
      }
      
      const newFile = {
        id: Date.now() + Math.random(),
        name: `${template.name}.txt`,
        size: template.content.length,
        type: 'text/plain',
        lastModified: Date.now(),
        file: createFileObject(template.content, `${template.name}.txt`, 'text/plain'),
        isTemplate: true
      }
      
      console.log('Adding new file:', newFile)
      setUploadedFiles(prev => {
        const updated = [...prev, newFile]
        console.log('Updated uploaded files:', updated)
        return updated
      })
      alert('Template added to library successfully!')
    } catch (error) {
      console.error('Error in addTemplateToLibrary:', error)
      alert('Error adding template to library: ' + error.message)
    }
  }

  const editTemplate = (template) => {
    console.log('Edit template called with:', template)
    
    try {
      // First add the template to uploaded files if it's not already there
      const existingFile = uploadedFiles.find(file => file.id === template.id)
      if (!existingFile) {
        const newFile = {
          id: template.id,
          name: `${template.name}.txt`,
          size: template.content.length,
          type: 'text/plain',
          lastModified: Date.now(),
          file: createFileObject(template.content, `${template.name}.txt`, 'text/plain'),
          isTemplate: true
        }
        setUploadedFiles(prev => [...prev, newFile])
        console.log('Template added to uploaded files')
      }
      
      setTextContent(template.content)
      setSelectedFile({
        id: template.id,
        name: `${template.name}.txt`,
        file: createFileObject(template.content, `${template.name}.txt`, 'text/plain'),
        isTemplate: true
      })
      setShowTextEditor(true)
      console.log('Text editor opened')
    } catch (error) {
      console.error('Error in editTemplate:', error)
      alert('Error opening template for editing: ' + error.message)
    }
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
                onClick={() => setIsCreateAnnouncementModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200"
              >
                <Plus className="w-4 h-4" />
                Create Announcement
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
        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'notices'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Notices & Announcements
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
          </div>
        </div>

        {/* Notices Tab */}
        {activeTab === 'notices' && (
          <>
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
                    {notice.type && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        notice.type === 'Announcement' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {notice.type}
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
                  <span className="text-sm text-gray-500">
                    By {notice.author}
                  </span>
                  <span className="text-sm text-gray-500">
                    To: {notice.recipients}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {formatDateToDDMMYYYY(notice.date)}
                  </span>
                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Open
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
          </>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <>
            {/* Template Library Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">HR Template Library</h2>
                <button
                  onClick={() => setShowTemplateLibrary(!showTemplateLibrary)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
                >
                  {showTemplateLibrary ? 'Hide Templates' : 'Browse Templates'}
                </button>
              </div>
              
              {showTemplateLibrary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {hrTemplates.map((template) => (
                    <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-orange-600" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {template.content.substring(0, 100)}...
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editTemplate(template)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white text-sm rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => addTemplateToLibrary(template)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm rounded-lg transition-colors"
                        >
                          Add to Library
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors mb-8 ${
                isDragOver 
                  ? 'border-orange-400 bg-orange-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleTemplateDrop}
              onDragOver={handleTemplateDragOver}
              onDragLeave={handleTemplateDragLeave}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Templates</h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your template files here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.svg"
                    onChange={handleTemplateFileInput}
                    className="hidden"
                    id="template-file-upload"
                  />
                  <label
                    htmlFor="template-file-upload"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium rounded-lg cursor-pointer transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Choose Files
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF, SVG
                </p>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Templates</h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-gray-900 font-medium">{file.name}</p>
                              {file.isTemplate && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                  Template
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEditTemplateFile(file)}
                          className="flex items-center px-3 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        
                        <button
                          onClick={() => handleDeleteTemplateFile(file.id)}
                          className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <CustomDateInput
                  value={formData.date}
                  onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="dd/mm/yyyy"
                />
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

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Individual Employees</label>
                      <button
                        type="button"
                        onClick={() => openEmployeeSelection('notice')}
                        className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                      >
                        Select Employees
                      </button>
                    </div>
                    {formData.selectedEmployees.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Selected Employees:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.selectedEmployees.map(emp => (
                            <span
                              key={emp.id}
                              className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                            >
                              {emp.name} ({emp.id})
                              <button
                                type="button"
                                onClick={() => handleFormEmployeeToggle(emp)}
                                className="ml-1 text-orange-600 hover:text-orange-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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

      {/* Create Announcement Modal */}
      {isCreateAnnouncementModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Announcement</h2>
                <button
                  onClick={() => setIsCreateAnnouncementModalOpen(false)}
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
                  value={announcementData.title}
                  onChange={(e) => setAnnouncementData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={announcementData.content}
                  onChange={(e) => setAnnouncementData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter announcement content"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <CustomDateInput
                  value={announcementData.date}
                  onChange={(value) => setAnnouncementData(prev => ({ ...prev, date: value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="dd/mm/yyyy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={announcementData.location}
                  onChange={(e) => setAnnouncementData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location (if applicable)"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="announcementRecipients"
                      value="All"
                      checked={announcementData.recipients === 'All'}
                      onChange={(e) => setAnnouncementData(prev => ({ ...prev, recipients: e.target.value }))}
                      className="mr-2"
                    />
                    All Employees
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="announcementRecipients"
                      value="Selected"
                      checked={announcementData.recipients === 'Selected'}
                      onChange={(e) => setAnnouncementData(prev => ({ ...prev, recipients: e.target.value }))}
                      className="mr-2"
                    />
                    Selected Employees
                  </label>
                </div>
              </div>

              {announcementData.recipients === 'Selected' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                    <div className="grid grid-cols-2 gap-2">
                      {departments.map(dept => (
                        <label key={dept} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={announcementData.departments.includes(dept)}
                            onChange={() => handleAnnouncementDepartmentChange(dept)}
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
                            checked={announcementData.designations.includes(desig)}
                            onChange={() => handleAnnouncementDesignationChange(desig)}
                            className="mr-2"
                          />
                          {desig}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Individual Employees</label>
                      <button
                        type="button"
                        onClick={() => openEmployeeSelection('announcement')}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Select Employees
                      </button>
                    </div>
                    {announcementData.selectedEmployees.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Selected Employees:</p>
                        <div className="flex flex-wrap gap-2">
                          {announcementData.selectedEmployees.map(emp => (
                            <span
                              key={emp.id}
                              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {emp.name} ({emp.id})
                              <button
                                type="button"
                                onClick={() => handleFormEmployeeToggle(emp)}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
                    onChange={handleAnnouncementFileUpload}
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
                
                {announcementData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {announcementData.attachments.map(attachment => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getFileIcon(attachment.type)}
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                        </div>
                        <button
                          onClick={() => removeAnnouncementAttachment(attachment.id)}
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
                onClick={() => setIsCreateAnnouncementModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAnnouncement}
                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-md"
              >
                <Send className="w-4 h-4 inline mr-2" />
                Send Announcement
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
                    <h3 className="font-medium text-gray-900 mb-2">Author</h3>
                    <p className="text-gray-600">{selectedNotice.author}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Date</h3>
                    <p className="text-gray-600">{formatDateToDDMMYYYY(selectedNotice.date)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Recipients</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {selectedNotice.recipients}
                      </span>
                    </div>
                    
                    {selectedNotice.recipients === 'All Employees' && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Sent to all employees</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">This notice was sent to all employees in the organization</p>
                      </div>
                    )}
                    
                    {selectedNotice.recipients === 'Selected' && (
                      <div className="space-y-3">
                        {selectedNotice.departments && selectedNotice.departments.length > 0 && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Departments</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {selectedNotice.departments.map((dept, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                  {dept}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedNotice.designations && selectedNotice.designations.length > 0 && (
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-800">Designations</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {selectedNotice.designations.map((designation, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                                  {designation}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedNotice.selectedEmployees && selectedNotice.selectedEmployees.length > 0 && (
                          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-800">Individual Employees</span>
                            </div>
                            <div className="space-y-1">
                              {selectedNotice.selectedEmployees.map((emp, index) => (
                                <div key={index} className="flex items-center justify-between text-xs">
                                  <span className="text-orange-700">{emp.name} ({emp.id})</span>
                                  <span className="text-orange-600">{emp.designation}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {selectedNotice.type === 'Announcement' && (
                  <>
                    {selectedNotice.date && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Date</h3>
                        <p className="text-gray-600">{formatDateToDDMMYYYY(selectedNotice.date)}</p>
                      </div>
                    )}
                    {selectedNotice.location && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                        <p className="text-gray-600">{selectedNotice.location}</p>
                      </div>
                    )}
                  </>
                )}

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

      {/* Template Share Modal */}
      {showShareModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Template</h3>
              <button
                onClick={closeShareModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Template: <span className="text-gray-900 font-medium">{selectedFile.name}</span></p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share with:</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shareType"
                      value="all"
                      checked={shareType === 'all'}
                      onChange={(e) => setShareType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-900">All Employees</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shareType"
                      value="selected"
                      checked={shareType === 'selected'}
                      onChange={(e) => setShareType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-900">Selected Employees</span>
                  </label>
                </div>
              </div>
              
              {shareType === 'selected' && (
                <div>
                  <button
                    onClick={() => setShowEmployeeList(!showEmployeeList)}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
                  >
                    {showEmployeeList ? 'Hide' : 'Select'} Employees ({selectedEmployees.length} selected)
                  </button>
                  
                  {showEmployeeList && (
                    <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
                      {mockEmployees.map((employee) => (
                        <label key={employee.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.some(emp => emp.id === employee.id)}
                            onChange={() => handleEmployeeToggle(employee)}
                            className="mr-3"
                          />
                          <div>
                            <p className="text-gray-900 text-sm">{employee.name}</p>
                            <p className="text-gray-500 text-xs">{employee.email} • {employee.department}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeShareModal}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendTemplate}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg transition-colors"
                >
                  Send Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Text Editor Modal */}
      {showTextEditor && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 h-5/6 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Text File: {selectedFile.name}</h3>
              <button
                onClick={closeTemplateTextEditor}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 mb-4">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full h-full p-4 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Edit your text content here..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={closeTemplateTextEditor}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveTemplateTextFile}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Selection Modal */}
      {showEmployeeSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Employees for {currentFormType === 'notice' ? 'Notice' : 'Announcement'}
              </h3>
              <button
                onClick={closeEmployeeSelection}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {loadingEmployees ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading employees...</div>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">No employees found</div>
                  <p className="text-sm text-gray-400">Add employees in the Employee Dashboard first</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {employees.map((employee) => {
                    const isSelected = currentFormType === 'notice' 
                      ? formData.selectedEmployees.find(emp => emp.id === employee.id)
                      : announcementData.selectedEmployees.find(emp => emp.id === employee.id)
                    
                    return (
                      <div
                        key={employee.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFormEmployeeToggle(employee)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{employee.name}</h4>
                            <p className="text-sm text-gray-600">ID: {employee.id}</p>
                            <p className="text-sm text-gray-500">
                              {employee.designation} • {employee.department}
                            </p>
                            <p className="text-xs text-gray-400">{employee.email}</p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleFormEmployeeToggle(employee)}
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeEmployeeSelection}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={closeEmployeeSelection}
                  className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoticesAnnouncements