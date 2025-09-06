import { useState } from 'react'

export default function Templates() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [shareType, setShareType] = useState('all') // 'all' or 'selected'
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [showEmployeeList, setShowEmployeeList] = useState(false)
  const [textContent, setTextContent] = useState('')
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)

  // Pre-built HR templates
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
    },
    {
      id: 'appointment-letter',
      name: 'Appointment Letter',
      type: 'txt',
      content: `APPOINTMENT LETTER

[COMPANY LETTERHEAD]

Date: [DATE]

To,
[EMPLOYEE NAME]
[EMPLOYEE ADDRESS]

Subject: Appointment as [POSITION]

Dear [EMPLOYEE NAME],

We are pleased to confirm your appointment as [POSITION] in our organization effective from [APPOINTMENT DATE].

Terms of Appointment:
- Designation: [POSITION]
- Department: [DEPARTMENT]
- Reporting Authority: [MANAGER NAME]
- Salary: [SALARY AMOUNT] per [PERIOD]
- Working Hours: [WORKING HOURS]
- Probation Period: [PROBATION PERIOD]
- Notice Period: [NOTICE PERIOD]

Please sign and return a copy of this letter as acceptance of the terms and conditions.

We look forward to a long and mutually beneficial association.

Best regards,
[HR MANAGER NAME]
[COMPANY NAME]
[CONTACT INFORMATION]`
    },
    {
      id: 'warning-letter',
      name: 'Warning Letter',
      type: 'txt',
      content: `WARNING LETTER

[COMPANY LETTERHEAD]

Date: [DATE]

To,
[EMPLOYEE NAME]
[EMPLOYEE ID]
[DEPARTMENT]

Subject: Warning Letter - [REASON]

Dear [EMPLOYEE NAME],

This is to bring to your notice that your recent conduct/performance has been unsatisfactory and requires immediate attention.

Issues Identified:
- [ISSUE 1]
- [ISSUE 2]
- [ISSUE 3]

This warning letter serves as a formal notice. We expect you to:
1. Improve your performance/conduct immediately
2. Follow company policies and procedures
3. Maintain professional standards

Failure to improve may result in further disciplinary action.

This warning will remain in your personnel file for [DURATION].

We hope you will take this seriously and work towards improvement.

Best regards,
[HR MANAGER NAME]
[COMPANY NAME]`
    },
    {
      id: 'termination-letter',
      name: 'Termination Letter',
      type: 'txt',
      content: `TERMINATION LETTER

[COMPANY LETTERHEAD]

Date: [DATE]

To,
[EMPLOYEE NAME]
[EMPLOYEE ID]
[ADDRESS]

Subject: Termination of Employment

Dear [EMPLOYEE NAME],

This letter serves as formal notice of termination of your employment with [COMPANY NAME] effective [TERMINATION DATE].

Reason for Termination:
[REASON FOR TERMINATION]

Final Settlement:
- Last working day: [LAST WORKING DAY]
- Final salary payment: [DATE]
- Notice period: [NOTICE PERIOD]
- Any pending dues will be settled as per company policy

Please return all company property including:
- Laptop/Computer
- Access cards
- Company documents
- Any other company assets

We wish you the best for your future endeavors.

Best regards,
[HR MANAGER NAME]
[COMPANY NAME]`
    }
  ]

  // Mock employee data - in real app this would come from API
  const mockEmployees = [
    { id: 1, name: 'John Doe', email: 'john.doe@company.com', department: 'HR' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', department: 'Finance' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'IT' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Marketing' },
    { id: 5, name: 'David Brown', email: 'david.brown@company.com', department: 'Operations' }
  ]

  const handleFileUpload = (files) => {
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

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    handleFileUpload(files)
  }

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleOpenFile = (file) => {
    // Open file in new tab for viewing
    const url = URL.createObjectURL(file.file)
    window.open(url, '_blank')
  }

  const handleEditFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase()
    
    // Check file type and provide appropriate editing options
    if (['txt'].includes(fileExtension)) {
      // For text files, open in a simple text editor modal
      openTextEditor(file)
    } else if (['doc', 'docx'].includes(fileExtension)) {
      // For Word documents, open in new tab for viewing
      const url = URL.createObjectURL(file.file)
      window.open(url, '_blank')
      alert('Word document opened in new tab. For editing, please use Microsoft Word Online or download the file.')
    } else if (['xls', 'xlsx'].includes(fileExtension)) {
      // For Excel files, open in new tab for viewing
      const url = URL.createObjectURL(file.file)
      window.open(url, '_blank')
      alert('Excel file opened in new tab. For editing, please use Microsoft Excel Online or download the file.')
    } else if (['pdf'].includes(fileExtension)) {
      // For PDF files, open in new tab
      const url = URL.createObjectURL(file.file)
      window.open(url, '_blank')
      alert('PDF file opened in new tab. For editing, please use a PDF editor or download the file.')
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExtension)) {
      // For image files, open in new tab
      const url = URL.createObjectURL(file.file)
      window.open(url, '_blank')
      alert('Image file opened in new tab. For editing, please use an image editor or download the file.')
    } else {
      // For other files, try to open in new tab
      const url = URL.createObjectURL(file.file)
      window.open(url, '_blank')
      alert('File opened in new tab. For editing, please use appropriate software or download the file.')
    }
  }

  const handleDeleteFile = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setUploadedFiles(prev => prev.filter(file => file.id !== id))
    }
  }

  const handleShareFile = (file) => {
    setSelectedFile(file)
    setShowShareModal(true)
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

  const openTextEditor = async (file) => {
    try {
      const text = await file.file.text()
      setTextContent(text)
      setSelectedFile(file)
      setShowTextEditor(true)
    } catch (error) {
      alert('Error reading file content')
    }
  }

  const saveTextFile = () => {
    if (selectedFile) {
      // Create a new file with the updated content
      const updatedFile = new File([textContent], selectedFile.name, { type: 'text/plain' })
      
      // Check if it's a template being edited
      if (selectedFile.isTemplate) {
        // Update the template in the library
        setUploadedFiles(prev => prev.map(file => 
          file.id === selectedFile.id 
            ? { ...file, file: updatedFile, size: updatedFile.size }
            : file
        ))
      } else {
        // Update the file in the uploaded files list
        setUploadedFiles(prev => prev.map(file => 
          file.id === selectedFile.id 
            ? { ...file, file: updatedFile, size: updatedFile.size }
            : file
        ))
      }
      
      setShowTextEditor(false)
      setSelectedFile(null)
      setTextContent('')
      alert('File saved successfully!')
    }
  }

  const closeTextEditor = () => {
    setShowTextEditor(false)
    setSelectedFile(null)
    setTextContent('')
  }

  const addTemplateToLibrary = (template) => {
    const newFile = {
      id: Date.now() + Math.random(),
      name: `${template.name}.txt`,
      size: template.content.length,
      type: 'text/plain',
      lastModified: Date.now(),
      file: new File([template.content], `${template.name}.txt`, { type: 'text/plain' }),
      isTemplate: true
    }
    setUploadedFiles(prev => [...prev, newFile])
  }

  const editTemplate = (template) => {
    setTextContent(template.content)
    setSelectedFile({
      id: template.id,
      name: `${template.name}.txt`,
      file: new File([template.content], `${template.name}.txt`, { type: 'text/plain' }),
      isTemplate: true
    })
    setShowTextEditor(true)
  }

  return (
    <div className='min-h-screen bg-gray-50 text-gray-900'>
      <div className='bg-white border-b border-gray-200 px-6 py-6 shadow-sm'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-gradient-to-r from-orange-300 to-orange-500 rounded-lg flex items-center justify-center'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
              </svg>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Template Upload</h1>
              <p className='text-gray-600'>Upload and manage document templates</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Template Library Section */}
        <div className='mb-8'>
              <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-bold text-gray-900'>HR Template Library</h2>
            <button
              onClick={() => setShowTemplateLibrary(!showTemplateLibrary)}
              className='px-4 py-2 bg-orange-300 hover:bg-orange-400 text-white rounded-lg transition-colors'
            >
              {showTemplateLibrary ? 'Hide Templates' : 'Browse Templates'}
            </button>
          </div>
          
          {showTemplateLibrary && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
              {hrTemplates.map((template) => (
                <div key={template.id} className='bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow'>
                  <div className='flex items-center justify-between mb-3'>
                    <h3 className='font-semibold text-gray-900'>{template.name}</h3>
                    <div className='w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center'>
                      <svg className='w-4 h-4 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
              </div>
              </div>
                  <p className='text-sm text-gray-600 mb-4 line-clamp-3'>
                    {template.content.substring(0, 100)}...
                  </p>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => editTemplate(template)}
                      className='flex-1 px-3 py-2 bg-orange-300 hover:bg-orange-400 text-white text-sm rounded-lg transition-colors'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => addTemplateToLibrary(template)}
                      className='flex-1 px-3 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm rounded-lg transition-colors'
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
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragOver 
              ? 'border-orange-400 bg-orange-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className='flex flex-col items-center space-y-4'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
              <svg className='w-8 h-8 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
              </svg>
            </div>
            <div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Upload Templates</h3>
              <p className='text-gray-600 mb-4'>
                Drag and drop your template files here, or click to browse
              </p>
              <input
                type='file'
                multiple
                accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.svg'
                onChange={handleFileInput}
                className='hidden'
                id='file-upload'
              />
              <label
                htmlFor='file-upload'
                className='inline-flex items-center px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-lg cursor-pointer transition-colors'
              >
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Choose Files
              </label>
            </div>
            <p className='text-sm text-gray-500'>
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF, SVG
            </p>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className='mt-8'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Uploaded Templates</h3>
            <div className='space-y-3'>
              {uploadedFiles.map((file) => (
                <div key={file.id} className='bg-white rounded-lg border border-gray-200 p-4 shadow-sm'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                        <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                        </svg>
              </div>
                      <div>
                        <div className='flex items-center gap-2'>
                          <p className='text-gray-900 font-medium'>{file.name}</p>
                          {file.isTemplate && (
                            <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800'>
                              Template
                    </span>
                          )}
                        </div>
                        <p className='text-sm text-gray-500'>{formatFileSize(file.size)}</p>
                </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex flex-wrap gap-2'>
                    <button
                      onClick={() => handleOpenFile(file)}
                      className='flex items-center px-3 py-2 bg-orange-300 hover:bg-orange-400 text-white text-sm rounded-lg transition-colors'
                    >
                      <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                      </svg>
                      Open
                    </button>
                    
                    <button
                      onClick={() => handleEditFile(file)}
                      className='flex items-center px-3 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm rounded-lg transition-colors'
                    >
                      <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                      </svg>
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleShareFile(file)}
                      className='flex items-center px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors'
                    >
                      <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z' />
                      </svg>
                      Share
                    </button>
                    
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className='flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors'
                    >
                      <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                      Delete
                    </button>
              </div>
            </div>
          ))}
        </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && selectedFile && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>Share Template</h3>
                <button
                  onClick={closeShareModal}
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
              
              <div className='mb-4'>
                <p className='text-gray-600 mb-2'>Template: <span className='text-gray-900 font-medium'>{selectedFile.name}</span></p>
              </div>
              
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Share with:</label>
                  <div className='space-y-2'>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='shareType'
                        value='all'
                        checked={shareType === 'all'}
                        onChange={(e) => setShareType(e.target.value)}
                        className='mr-2'
                      />
                      <span className='text-gray-900'>All Employees</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='shareType'
                        value='selected'
                        checked={shareType === 'selected'}
                        onChange={(e) => setShareType(e.target.value)}
                        className='mr-2'
                      />
                      <span className='text-gray-900'>Selected Employees</span>
                    </label>
              </div>
                </div>
                
                {shareType === 'selected' && (
                  <div>
                    <button
                      onClick={() => setShowEmployeeList(!showEmployeeList)}
                      className='w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors'
                    >
                      {showEmployeeList ? 'Hide' : 'Select'} Employees ({selectedEmployees.length} selected)
                    </button>
                    
                    {showEmployeeList && (
                      <div className='mt-3 max-h-40 overflow-y-auto space-y-2'>
                        {mockEmployees.map((employee) => (
                          <label key={employee.id} className='flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer'>
                            <input
                              type='checkbox'
                              checked={selectedEmployees.some(emp => emp.id === employee.id)}
                              onChange={() => handleEmployeeToggle(employee)}
                              className='mr-3'
                            />
                            <div>
                              <p className='text-gray-900 text-sm'>{employee.name}</p>
                              <p className='text-gray-500 text-xs'>{employee.email} • {employee.department}</p>
              </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className='flex gap-3 pt-4'>
                  <button
                    onClick={closeShareModal}
                    className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendTemplate}
                    className='flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors'
                  >
                    Send Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Text Editor Modal */}
        {showTextEditor && selectedFile && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl p-6 w-full max-w-4xl mx-4 h-5/6 flex flex-col shadow-xl'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>Edit Text File: {selectedFile.name}</h3>
                <button
                  onClick={closeTextEditor}
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
              
              <div className='flex-1 mb-4'>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className='w-full h-full p-4 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  placeholder='Edit your text content here...'
                />
              </div>
              
              <div className='flex gap-3'>
                <button
                  onClick={closeTextEditor}
                  className='px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors'
                >
                  Cancel
                </button>
                <button
                  onClick={saveTextFile}
                  className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors'
                >
                  Save Changes
                </button>
              </div>
            </div>
        </div>
        )}
      </div>
    </div>
  )
}
