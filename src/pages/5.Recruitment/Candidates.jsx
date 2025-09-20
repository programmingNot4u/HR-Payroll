import React, { useState, useEffect } from 'react'
import organizationalDataService from '../../services/organizationalDataService'

const Candidates = () => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Ahmed Rahman',
      email: 'ahmed.rahman@email.com',
      phone: '+880 1712-345678',
      position: 'Senior Production Manager',
      designation: 'Production Manager',
      department: 'Production',
      jobId: 'JOB-001',
      experience: '7 years',
      education: 'BSc Textile Engineering',
      location: 'Dhaka, Bangladesh',
      status: 'Shortlisted',
      appliedDate: '2024-01-20',
      lastContact: '2024-01-25',
      skills: ['Production Management', 'Team Leadership', 'Quality Control', 'SAP'],
      source: 'LinkedIn',
      rating: 4.5,
      notes: 'Strong leadership experience in RMG sector, excellent communication skills'
    },
    {
      id: 2,
      name: 'Fatima Begum',
      email: 'fatima.begum@email.com',
      phone: '+880 1812-345678',
      position: 'Quality Control Supervisor',
      designation: 'Quality Supervisor',
      department: 'Quality Assurance',
      jobId: 'JOB-002',
      experience: '4 years',
      education: 'Diploma Textile Technology',
      location: 'Chittagong, Bangladesh',
      status: 'Interview Scheduled',
      appliedDate: '2024-01-18',
      lastContact: '2024-01-26',
      skills: ['Quality Control', 'Inspection', 'ISO Standards', 'MS Office'],
      source: 'Company Website',
      rating: 4.2,
      notes: 'Good technical knowledge, needs to improve English communication'
    },
    {
      id: 3,
      name: 'Karim Hossain',
      email: 'karim.hossain@email.com',
      phone: '+880 1912-345678',
      position: 'Fashion Designer',
      designation: 'Designer',
      department: 'Design',
      jobId: 'JOB-003',
      experience: '3 years',
      education: 'BSc Fashion Design',
      location: 'Dhaka, Bangladesh',
      status: 'Under Review',
      appliedDate: '2024-01-22',
      lastContact: '2024-01-24',
      skills: ['Adobe Creative Suite', 'Pattern Making', 'Trend Analysis', 'Sketching'],
      source: 'Job Portal',
      rating: 4.0,
      notes: 'Creative portfolio, international design experience, good English'
    },
    {
      id: 4,
      name: 'Nusrat Jahan',
      email: 'nusrat.jahan@email.com',
      phone: '+880 1612-345678',
      position: 'Machine Operator',
      designation: 'Operator',
      department: 'Production',
      jobId: 'JOB-004',
      experience: '2 years',
      education: 'High School',
      location: 'Narayanganj, Bangladesh',
      status: 'Applied',
      appliedDate: '2024-01-25',
      lastContact: '2024-01-25',
      skills: ['Sewing Machine Operation', 'Equipment Maintenance', 'Team Work', 'Safety'],
      source: 'Referral',
      rating: 3.8,
      notes: 'Previous experience in similar role, reliable worker, needs training'
    },
    {
      id: 5,
      name: 'Rashid Ahmed',
      email: 'rashid.ahmed@email.com',
      phone: '+880 1512-345678',
      position: 'HR Coordinator',
      designation: 'HR Coordinator',
      department: 'Human Resources',
      jobId: 'JOB-005',
      experience: '3 years',
      education: 'BBA HRM',
      location: 'Dhaka, Bangladesh',
      status: 'Rejected',
      appliedDate: '2024-01-19',
      lastContact: '2024-01-23',
      skills: ['Recruitment', 'Employee Relations', 'MS Office', 'Communication'],
      source: 'LinkedIn',
      rating: 3.5,
      notes: 'Limited RMG industry experience, better suited for other sectors'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterDesignation, setFilterDesignation] = useState('')

  // Load organizational data
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])

  useEffect(() => {
    // Load departments and designations from organizational data service
    setDepartments(organizationalDataService.getDepartmentNames())
    setDesignations(organizationalDataService.getDesignationNames())
  }, [])

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.jobId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === '' || candidate.department === filterDepartment
    const matchesDesignation = filterDesignation === '' || candidate.designation === filterDesignation

    return matchesSearch && matchesDepartment && matchesDesignation
  })

  const totalCandidates = candidates.length
  const shortlistedCandidates = candidates.filter(c => c.status === 'Shortlisted').length
  const interviewScheduled = candidates.filter(c => c.status === 'Interview Scheduled').length
  const avgRating = (candidates.reduce((sum, c) => sum + c.rating, 0) / totalCandidates).toFixed(1)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted': return 'bg-green-100 text-green-800'
      case 'Interview Scheduled': return 'bg-blue-100 text-blue-800'
      case 'Under Review': return 'bg-yellow-100 text-yellow-800'
      case 'Applied': return 'bg-gray-100 text-gray-800'
      case 'Hired': return 'bg-purple-100 text-purple-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidates</h1>
          <p className="text-gray-600">Manage job applicants and recruitment pipeline for RMG positions</p>
        </div>

        {/* Search Bar - Moved to Top */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, position, or job ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Designations</option>
                {designations.map(designation => (
                  <option key={designation} value={designation}>{designation}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterDepartment('')
                  setFilterDesignation('')
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{totalCandidates}</p>
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
                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">{shortlistedCandidates}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{interviewScheduled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
              </div>
            </div>
          </div>
        </div>


        {/* Candidates List */}
        <div className="space-y-4">
          {filteredCandidates.map(candidate => (
            <div key={candidate.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{candidate.name}</h3>
                      <p className="text-lg text-gray-600 mb-2">{candidate.position}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{candidate.department}</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">{candidate.designation}</span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">{candidate.jobId}</span>
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">{candidate.experience}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-600 mr-2">Rating:</span>
                        <span className="text-lg font-bold text-orange-600">{candidate.rating}/5</span>
                      </div>
                      <p className="text-sm text-gray-500">Applied: {candidate.appliedDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-gray-900">{candidate.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="text-gray-900">{candidate.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-gray-900">{candidate.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Education</p>
                      <p className="text-gray-900">{candidate.education}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Notes:</p>
                    <p className="text-gray-700">{candidate.notes}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Last Contact:</span> {candidate.lastContact}
                    </p>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        View Profile
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        Schedule Interview
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                        Send Email
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Candidates
