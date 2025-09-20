import React, { useState, useEffect } from 'react'
import organizationalDataService from '../../services/organizationalDataService'

const JobOpenings = () => {
  const [jobOpenings, setJobOpenings] = useState(() => {
    const savedJobs = localStorage.getItem('jobOpenings')
    return savedJobs ? JSON.parse(savedJobs) : []
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterDesignation, setFilterDesignation] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [jobForm, setJobForm] = useState({
    jobOpeningId: '',
    designation: '',
    department: '',
    salaryRange: '',
    experience: '',
    postedDate: '',
    description: '',
    requirements: [''],
    deadline: '',
    manpower: ''
  })

  // Load organizational data
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const statuses = ['Active', 'Closed', 'On Hold']

  useEffect(() => {
    // Load departments and designations from organizational data service
    setDepartments(organizationalDataService.getDepartmentNames())
    setDesignations(organizationalDataService.getDesignationNames())
  }, [])

  // Save jobOpenings to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('jobOpenings', JSON.stringify(jobOpenings))
  }, [jobOpenings])

  // Date formatting functions
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    // If the date is already in dd/mm/yyyy format, return as is
    if (dateString.includes('/') && dateString.split('/').length === 3) {
      return dateString
    }
    // Otherwise, parse as a date and format to dd/mm/yyyy
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ''
    // If the date is already in dd/mm/yyyy format, return as is
    if (dateString.includes('/') && dateString.split('/').length === 3) {
      return dateString
    }
    // Otherwise, parse as a date and format to dd/mm/yyyy
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const parseDateFromInput = (dateString) => {
    if (!dateString) return ''
    const [day, month, year] = dateString.split('/')
    return `${year}-${month}-${day}`
  }

  // Auto-format date input with "/" separators
  const handleDateInput = (value, field) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '')
    
    // Limit to 8 digits (ddmmyyyy)
    const limitedValue = numericValue.slice(0, 8)
    
    // Format with "/" separators
    let formattedValue = limitedValue
    if (limitedValue.length >= 3) {
      formattedValue = limitedValue.slice(0, 2) + '/' + limitedValue.slice(2)
    }
    if (limitedValue.length >= 5) {
      formattedValue = limitedValue.slice(0, 2) + '/' + limitedValue.slice(2, 4) + '/' + limitedValue.slice(4)
    }
    
    handleJobFormChange(field, formattedValue)
  }

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === '' || job.department === filterDepartment
    const matchesDesignation = filterDesignation === '' || job.designation === filterDesignation
    const matchesStatus = filterStatus === '' || job.status === filterStatus

    return matchesSearch && matchesDepartment && matchesDesignation && matchesStatus
  })

  const totalOpenings = jobOpenings.length
  const activeOpenings = jobOpenings.filter(job => job.status === 'Active').length
  const onHoldOpenings = jobOpenings.filter(job => job.status === 'On Hold').length
  const closedOpenings = jobOpenings.filter(job => job.status === 'Closed').length

  const handleJobFormChange = (field, value) => {
    setJobForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...jobForm.requirements]
    newRequirements[index] = value
    setJobForm(prev => ({
      ...prev,
      requirements: newRequirements
    }))
  }

  const addRequirement = () => {
    setJobForm(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const removeRequirement = (index) => {
    const newRequirements = jobForm.requirements.filter((_, i) => i !== index)
    setJobForm(prev => ({
      ...prev,
      requirements: newRequirements
    }))
  }

  const handleSubmitJob = (e) => {
    e.preventDefault()
    if (editingJob) {
      handleUpdateJob(e)
    } else {
      const newJob = {
        id: jobOpenings.length + 1,
        title: jobForm.designation,
        designation: jobForm.designation,
        department: jobForm.department,
        type: 'Full-time', // Default type
        experience: jobForm.experience,
        salary: jobForm.salaryRange,
        status: 'Active',
        postedDate: jobForm.postedDate,
        deadline: jobForm.deadline,
        applications: 0,
        description: jobForm.description,
        requirements: jobForm.requirements.filter(req => req.trim() !== ''),
        manpower: parseInt(jobForm.manpower) || 0,
        jobOpeningId: jobForm.jobOpeningId
      }
      
      setJobOpenings(prev => [...prev, newJob])
      handleCancelJob()
    }
  }

  const handleCancelJob = () => {
    setShowJobForm(false)
    setEditingJob(null)
    setJobForm({
      jobOpeningId: '',
      designation: '',
      department: '',
      salaryRange: '',
      experience: '',
      postedDate: '',
      description: '',
      requirements: [''],
      deadline: '',
      manpower: ''
    })
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
    setJobForm({
      jobOpeningId: job.jobOpeningId || '',
      designation: job.designation || '',
      department: job.department || '',
      salaryRange: job.salary || '',
      experience: job.experience || '',
      postedDate: job.postedDate || '',
      description: job.description || '',
      requirements: job.requirements && job.requirements.length > 0 ? job.requirements : [''],
      deadline: job.deadline || '',
      manpower: job.manpower || ''
    })
    setShowJobForm(true)
  }

  const handleUpdateJob = (e) => {
    e.preventDefault()
    setJobOpenings(prev => prev.map(job => 
      job.id === editingJob.id 
        ? {
            ...job,
            jobOpeningId: jobForm.jobOpeningId,
            title: jobForm.designation,
            designation: jobForm.designation,
            department: jobForm.department,
            salary: jobForm.salaryRange,
            experience: jobForm.experience,
            postedDate: jobForm.postedDate,
            description: jobForm.description,
            requirements: jobForm.requirements.filter(req => req.trim() !== ''),
            deadline: jobForm.deadline,
            manpower: parseInt(jobForm.manpower) || 0
          }
        : job
    ))
    handleCancelJob()
  }

  const handleHoldJob = (jobId) => {
    setJobOpenings(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: job.status === 'On Hold' ? 'Active' : 'On Hold' }
        : job
    ))
  }

  const handleCloseJob = (jobId) => {
    setJobOpenings(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'Closed' }
        : job
    ))
  }

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setJobOpenings(prev => prev.filter(job => job.id !== jobId))
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Openings</h1>
              <p className="text-gray-600">Manage recruitment opportunities for RMG industry positions</p>
            </div>
            <button
              onClick={() => setShowJobForm(true)}
              className="px-6 py-3 text-white rounded-lg transition-colors flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Open A Job
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Openings</p>
                <p className="text-2xl font-bold text-gray-900">{totalOpenings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Openings</p>
                <p className="text-2xl font-bold text-gray-900">{activeOpenings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Hold</p>
                <p className="text-2xl font-bold text-gray-900">{onHoldOpenings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-gray-900">{closedOpenings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search jobs, designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <select
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Designations</option>
                {designations.map(designation => (
                  <option key={designation} value={designation}>{designation}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterDepartment('')
                  setFilterDesignation('')
                  setFilterStatus('')
                }}
                className="w-full px-4 py-2 text-white rounded-md transition-colors"
                style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Job Opening Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingJob ? 'Edit Job' : 'Open A Job'}
                  </h2>
                  <button
                    onClick={handleCancelJob}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmitJob} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Opening ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Opening ID</label>
                    <input
                      type="text"
                      value={jobForm.jobOpeningId}
                      onChange={(e) => handleJobFormChange('jobOpeningId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter job opening ID"
                      required
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <select
                      value={jobForm.designation}
                      onChange={(e) => handleJobFormChange('designation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Designation</option>
                      {designations.map(designation => (
                        <option key={designation} value={designation}>{designation}</option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={jobForm.department}
                      onChange={(e) => handleJobFormChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                    <input
                      type="text"
                      value={jobForm.salaryRange}
                      onChange={(e) => handleJobFormChange('salaryRange', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ৳50,000 - ৳80,000"
                      required
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      value={jobForm.experience}
                      onChange={(e) => handleJobFormChange('experience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 3-5 years"
                      required
                    />
                  </div>

                  {/* Posted Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Posted Date</label>
                    <input
                      type="text"
                      value={jobForm.postedDate}
                      onChange={(e) => handleDateInput(e.target.value, 'postedDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="dd/mm/yyyy"
                      maxLength="10"
                      required
                    />
                  </div>

                  {/* Manpower */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Manpower (Person)</label>
                    <input
                      type="number"
                      value={jobForm.manpower}
                      onChange={(e) => handleJobFormChange('manpower', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 5"
                      required
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <input
                      type="text"
                      value={jobForm.deadline}
                      onChange={(e) => handleDateInput(e.target.value, 'deadline')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="dd/mm/yyyy"
                      maxLength="10"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={jobForm.description}
                      onChange={(e) => handleJobFormChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter job description"
                      required
                    />
                  </div>

                  {/* Requirements */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <div className="space-y-2">
                      {jobForm.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={requirement}
                              onChange={(e) => handleRequirementChange(index, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder={`Requirement ${index + 1}`}
                            />
                          </div>
                          {jobForm.requirements.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRequirement(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addRequirement}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Requirement
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelJob}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white rounded-md transition-colors"
                    style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                    onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                    onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
                  >
                    {editingJob ? 'Update Job' : 'Create Job Opening'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow p-6 relative">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                          <div className="mb-3">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">{job.designation}</span> || <span className="font-medium">{job.department}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{job.salary}</p>
                          <p className="text-sm text-gray-500">Monthly</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Notification Bar */}
                  {job.status === 'On Hold' && (
                    <div className="w-full mb-4">
                      <div className="flex items-center justify-center px-6 py-3 rounded-lg bg-yellow-100 border-2 border-yellow-300 shadow-sm">
                        <svg className="w-5 h-5 mr-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                        </svg>
                        <span className="text-lg font-semibold text-yellow-800">JOB ON HOLD</span>
                      </div>
                    </div>
                  )}
                  
                  {job.status === 'Closed' && (
                    <div className="w-full mb-4">
                      <div className="flex items-center justify-center px-6 py-3 rounded-lg bg-red-100 border-2 border-red-300 shadow-sm">
                        <svg className="w-5 h-5 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 00-1 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 10-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span className="text-lg font-semibold text-red-800">JOB CLOSED</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Job ID</p>
                      <p className="text-gray-900">{job.jobOpeningId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Experience</p>
                      <p className="text-gray-900">{job.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Manpower</p>
                      <p className="text-gray-900">{job.manpower} Person{job.manpower !== 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Posted Date</p>
                      <p className="text-gray-900">{job.postedDate}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{job.description}</p>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="text-gray-700 text-sm">{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Deadline:</span> {job.deadline}
                    </p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditJob(job)}
                        className="px-4 py-2 text-white rounded-md transition-colors"
                        style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
                      >
                        Edit Job
                      </button>
                      <button 
                        onClick={() => handleHoldJob(job.id)}
                        className="px-4 py-2 text-white rounded-md transition-colors"
                        style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
                      >
                        {job.status === 'On Hold' ? 'Activate Job' : 'Hold Job'}
                      </button>
                      <button 
                        onClick={() => handleCloseJob(job.id)}
                        className="px-4 py-2 text-white rounded-md transition-colors"
                        style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
                      >
                        Close Job
                      </button>
                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        className="px-4 py-2 text-white rounded-md transition-colors"
                        style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
                      >
                        Delete Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobOpenings
